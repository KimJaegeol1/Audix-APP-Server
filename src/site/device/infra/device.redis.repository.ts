import { Injectable } from "@nestjs/common";
import { InjectRedis } from "@nestjs-modules/ioredis";
import Redis from "ioredis";

export interface DeviceData {
    deviceId: number;
    status: string;
    normalScore: number;
    name: string;
    address: string;
    updatedAt: Date;
}

@Injectable()
export class DeviceRedisRepository {
    constructor(@InjectRedis() private readonly redis: Redis) { }

    // 생성 로직
    async createDevice(deviceData: DeviceData): Promise<void> {
        const deviceKey = `device:${deviceData.deviceId}`;

        // 기존 데이터 존재 여부 확인
        const exists = await this.redis.exists(deviceKey);
        if (exists) {
            throw new Error("이미 존재하는 기기입니다.")
        }

        const hashData = {
            deviceId: deviceData.deviceId.toString(),
            status: deviceData.status,
            normalScore: deviceData.normalScore.toString(),
            name: deviceData.name,
            address: deviceData.address,
            updatedAt: deviceData.updatedAt.toISOString(),
        }

        await this.redis.hset(deviceKey, hashData);
    }

    // 모든 기기 조회
    async getAllDevices(): Promise<DeviceData[]> {
        const keys = await this.redis.keys("device:*");
        const devices: DeviceData[] = [];

        for (const key of keys) {
            const data = await this.redis.hgetall(key);
            if (data) {
                devices.push({
                    deviceId: parseInt(data.deviceId),
                    status: data.status,
                    normalScore: parseFloat(data.normalScore),
                    name: data.name,
                    address: data.address,
                    updatedAt: new Date(data.updatedAt),
                });
            }
        }

        return devices;
    }

    // id로 기기 조회
    async getDeviceById(deviceId: number): Promise<DeviceData | null> {
        const deviceKey = `device:${deviceId}`;
        const data = await this.redis.hgetall(deviceKey);

        if (!data || Object.keys(data).length === 0) {
            return null;
        }

        return {
            deviceId: parseInt(data.deviceId),
            status: data.status,
            normalScore: parseFloat(data.normalScore),
            name: data.name,
            address: data.address,
            updatedAt: new Date(data.updatedAt),
        };
    }

    // 업데이트 로직
    async updateDevice(deviceId: number, updateData: Partial<DeviceData>): Promise<void> {
        const deviceKey = `device:${deviceId}`;
        const exists = await this.redis.exists(deviceKey);

        if (!exists) {
            throw new Error("존재하지 않는 기기입니다.");
        }

        const hashData: Record<string, string> = {};
        if (updateData.status !== undefined) hashData.status = updateData.status;
        if (updateData.normalScore !== undefined) hashData.normalScore = updateData.normalScore.toString();
        if (updateData.name !== undefined) hashData.name = updateData.name;
        if (updateData.address !== undefined) hashData.address = updateData.address;
        if (updateData.updatedAt !== undefined) hashData.updatedAt = updateData.updatedAt.toISOString();

        await this.redis.hset(deviceKey, hashData);
    }

    // 삭제 로직
    async deleteDevice(deviceId: number): Promise<void> {
        const deviceKey = `device:${deviceId}`;
        const exists = await this.redis.exists(deviceKey);

        if (!exists) {
            throw new Error("존재하지 않는 기기입니다.");
        }

        await this.redis.del(deviceKey)
    }
}