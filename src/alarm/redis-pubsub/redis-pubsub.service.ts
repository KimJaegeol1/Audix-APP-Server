import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { DeviceAlertGateway } from '../websocket/device-alert.gateway';

export interface DeviceAlertMessage {
    deviceId: number;
    normalScore: number;
}

interface AlertData {
    key: string;
    deviceId: string;
    normalScore: string;
    timestamp: string;
    type: string;
}

interface DeviceData {
    deviceId: number;
    areaId?: number;
    name: string;
    model: string;
    address: string;
    deviceManager: string;
    parts: any;
    normalScore: number;
    image: string;
    status: string;
    aiText: string;
}

@Injectable()
export class RedisPubSubService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(RedisPubSubService.name);
    private subscriber: Redis;

    constructor(@InjectRedis() private readonly redis: Redis, private readonly deviceAlertGateway: DeviceAlertGateway) {
        // 구독 전용 Redis 클라이언트 생성
        this.subscriber = this.redis.duplicate();
    }

    async onModuleInit() {
        this.logger.log('Redis PubSub 서비스 초기화 중...');

        // device_alerts 채널 구독
        await this.subscriber.subscribe('device_alerts');

        // 메시지 수신 처리
        this.subscriber.on('message', (channel: string, message: string) => {
            this.handleMessage(channel, message);
        });

        this.logger.log('✅ Redis PubSub 서비스 초기화 완료 - device_alerts 채널 구독 중');
    }

    async onModuleDestroy() {
        this.logger.log('Redis PubSub 서비스 종료...');
        await this.subscriber.unsubscribe('device_alerts');
        await this.subscriber.quit();
    }

    private async handleMessage(channel: string, message: string) {
        try {
            if (channel === 'device_alerts') {
                const alertData: DeviceAlertMessage = JSON.parse(message);
                this.logger.warn(
                    `🚨 이상 감지 알림: Device ${alertData.deviceId}, NormalScore: ${alertData.normalScore}`
                );

                // Redis에서 해당 device의 전체 정보 조회
                const deviceInfo = await this.getDeviceInfo(alertData.deviceId);

                if (deviceInfo) {
                    // 알림 메시지와 디바이스 정보를 합쳐서 전송
                    const alertMessage = {
                        ...deviceInfo,
                        normalScore: alertData.normalScore, // 새로운 normalScore로 업데이트
                        message: this.generateAlertMessage(deviceInfo, alertData.normalScore),
                        timestamp: new Date().toISOString()
                    };

                    this.deviceAlertGateway.sendAlert(alertMessage);
                    this.logger.log(`📡 전체 디바이스 정보와 함께 알림 전송: ${JSON.stringify(alertMessage)}`);
                } else {
                    this.logger.error(`❌ Device ${alertData.deviceId} 정보를 찾을 수 없음`);
                    // 디바이스 정보가 없어도 기본 알림은 전송
                    this.deviceAlertGateway.sendAlert({
                        deviceId: alertData.deviceId,
                        normalScore: alertData.normalScore,
                        message: `Device ${alertData.deviceId} 이상 감지`,
                        timestamp: new Date().toISOString()
                    });
                }
            }
        } catch (error) {
            this.logger.error(`메시지 처리 오류: ${error.message}`, error.stack);
        }
    }

    // 테스트용 메시지 발행 메서드
    async publishTestAlert(deviceId: number, normalScore: number) {
        const message = JSON.stringify({ deviceId, normalScore });
        await this.redis.publish('device_alerts', message);
        this.logger.log(`테스트 알림 발행: ${message}`);
    }

    // Redis에서 device 정보 조회
    private async getDeviceInfo(deviceId: number): Promise<DeviceData | null> {
        try {
            const deviceKey = `device:${deviceId}`;
            const data = await this.redis.hgetall(deviceKey);

            if (!data || Object.keys(data).length === 0) {
                this.logger.warn(`Device ${deviceId} 정보가 Redis에 없음`);
                return null;
            }

            return {
                deviceId: parseInt(data.deviceId),
                areaId: data.areaId ? parseInt(data.areaId) : undefined,
                name: data.name || '',
                model: data.model || '',
                address: data.address || '',
                deviceManager: data.deviceManager || '',
                parts: JSON.parse(data.parts || '{}'),
                normalScore: parseFloat(data.normalScore || '0'),
                image: data.image || '',
                status: data.status || 'unknown',
                aiText: data.aiText || '',
            };
        } catch (error) {
            this.logger.error(`Device ${deviceId} 정보 조회 오류: ${error.message}`);
            return null;
        }
    }

    // 알림 메시지 생성
    private generateAlertMessage(deviceInfo: DeviceData, normalScore: number): string {
        const status = this.determineDeviceStatus(normalScore);
        const deviceName = deviceInfo.name || `Device-${deviceInfo.deviceId}`;

        switch (status) {
            case 'danger':
                return `${deviceName}에서 심각한 이상음이 감지되었습니다. 즉시 확인이 필요합니다.`;
            case 'warning':
                return `${deviceName}에서 주의가 필요한 이상음이 감지되었습니다.`;
            case 'normal':
                return `${deviceName}이 정상 상태로 복구되었습니다.`;
            default:
                return `${deviceName}의 상태를 확인해주세요.`;
        }
    }

    // normalScore에 따른 상태 판단
    private determineDeviceStatus(normalScore: number): string {
        if (normalScore >= 0.8) return 'normal';
        if (normalScore >= 0.6) return 'warning';
        if (normalScore >= 0.4) return 'warning';
        return 'danger';
    }

    // 모든 알림 히스토리 조회
    async getAllAlerts(): Promise<AlertData[]> {
        try {
            // alert:* 패턴으로 모든 알림 키 찾기
            const alertKeys = await this.redis.keys('alert:*');

            if (alertKeys.length === 0) {
                return [];
            }

            // 각 키의 데이터 가져오기
            const alerts: AlertData[] = [];
            for (const key of alertKeys) {
                const alertData = await this.redis.hgetall(key);
                if (alertData && Object.keys(alertData).length > 0) {
                    alerts.push({
                        key,
                        deviceId: alertData.deviceId || '',
                        normalScore: alertData.normalScore || '',
                        timestamp: alertData.timestamp || '',
                        type: alertData.type || ''
                    });
                }
            }

            // 시간순으로 정렬 (최신순)
            alerts.sort((a, b) => {
                const timeA = new Date(a.timestamp).getTime();
                const timeB = new Date(b.timestamp).getTime();
                return timeB - timeA;
            });

            return alerts;
        } catch (error) {
            this.logger.error(`알림 히스토리 조회 오류: ${error.message}`, error.stack);
            return [];
        }
    }
}
