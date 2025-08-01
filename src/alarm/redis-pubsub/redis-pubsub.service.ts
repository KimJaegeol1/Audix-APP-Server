import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

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

@Injectable()
export class RedisPubSubService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(RedisPubSubService.name);
    private subscriber: Redis;

    constructor(@InjectRedis() private readonly redis: Redis) {
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

    private handleMessage(channel: string, message: string) {
        try {
            if (channel === 'device_alerts') {
                const alertData: DeviceAlertMessage = JSON.parse(message);
                this.logger.warn(
                    `🚨 이상 감지 알림: Device ${alertData.deviceId}, NormalScore: ${alertData.normalScore}`
                );

                // 여기서 추가 처리 로직 수행
                this.processDeviceAlert(alertData);
            }
        } catch (error) {
            this.logger.error(`메시지 처리 오류: ${error.message}`, error.stack);
        }
    }

    private async processDeviceAlert(alertData: DeviceAlertMessage) {
        try {
            // 1. 장비 상태를 "warning" 또는 "abnormal"로 업데이트
            const deviceKey = `device:${alertData.deviceId}`;
            await this.redis.hset(deviceKey, {
                status: 'abnormal',
                lastAlertTime: new Date().toISOString(),
                normalScore: alertData.normalScore.toString()
            });

            // 2. 알림 로그 저장 (필요시)
            const alertLogKey = `alert:${alertData.deviceId}:${Date.now()}`;
            await this.redis.hset(alertLogKey, {
                deviceId: alertData.deviceId.toString(),
                normalScore: alertData.normalScore.toString(),
                timestamp: new Date().toISOString(),
                type: 'low_normal_score'
            });

            // 3. 알림 만료시간 설정 (7일)
            await this.redis.expire(alertLogKey, 7 * 24 * 60 * 60);

            this.logger.log(`✅ 장비 ${alertData.deviceId} 이상 상태로 업데이트 완료`);

        } catch (error) {
            this.logger.error(`장비 알림 처리 오류: ${error.message}`, error.stack);
        }
    }

    // 테스트용 메시지 발행 메서드
    async publishTestAlert(deviceId: number, normalScore: number) {
        const message = JSON.stringify({ deviceId, normalScore });
        await this.redis.publish('device_alerts', message);
        this.logger.log(`테스트 알림 발행: Device ${deviceId}, Score ${normalScore}`);
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
