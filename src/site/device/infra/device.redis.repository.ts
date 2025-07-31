import { Injectable } from "@nestjs/common";
import { InjectRedis } from "@nestjs-modules/ioredis";
import Redis from "ioredis";

export interface DeviceDataInRedis {
    deviceId: number;
    areaId?: number;
    status: string;
    normalScore: number;
    name: string;
    address: string;
}

@Injectable()
export class DeviceRedisRepository {
    constructor(@InjectRedis() private readonly redis: Redis) { }

    // 생성 로직
    async createDevice(deviceDataInRedis: DeviceDataInRedis): Promise<void> {
        const deviceKey = `device:${deviceDataInRedis.deviceId}`;

        // 기존 데이터 존재 여부 확인
        const exists = await this.redis.exists(deviceKey);
        if (exists) {
            throw new Error("이미 존재하는 기기입니다.")
        }

        const hashData = {
            deviceId: deviceDataInRedis.deviceId.toString(),
            areaId: deviceDataInRedis.areaId ? deviceDataInRedis.areaId.toString() : undefined,
            status: deviceDataInRedis.status,
            normalScore: deviceDataInRedis.normalScore.toString(),
            name: deviceDataInRedis.name,
            address: deviceDataInRedis.address,
        }

        await this.redis.hset(deviceKey, hashData);
    }

    // 모든 기기 조회
    async getAllDevices(): Promise<DeviceDataInRedis[]> {
        const keys = await this.redis.keys("device:*");
        const devices: DeviceDataInRedis[] = [];

        for (const key of keys) {
            const data = await this.redis.hgetall(key);
            if (data) {
                devices.push({
                    deviceId: parseInt(data.deviceId),
                    areaId: data.areaId ? parseInt(data.areaId) : undefined,
                    status: data.status,
                    normalScore: parseFloat(data.normalScore),
                    name: data.name,
                    address: data.address,
                });
            }
        }

        return devices;
    }

    // deviceId로 기기 조회
    async getDeviceByDeviceId(deviceId: number): Promise<DeviceDataInRedis | null> {
        const deviceKey = `device:${deviceId}`;
        const data = await this.redis.hgetall(deviceKey);

        if (!data || Object.keys(data).length === 0) {
            return null;
        }

        return {
            deviceId: parseInt(data.deviceId),
            areaId: data.areaId ? parseInt(data.areaId) : undefined,
            status: data.status,
            normalScore: parseFloat(data.normalScore),
            name: data.name,
            address: data.address,
        };
    }

    // areaId로 기기 조회
    async getDevicesByAreaId(areaId: number): Promise<DeviceDataInRedis[]> {
        const keys = await this.redis.keys(`device:*`);
        const devices: DeviceDataInRedis[] = [];

        for (const key of keys) {
            const data = await this.redis.hgetall(key);
            if (data && data.areaId && parseInt(data.areaId) === areaId) {
                devices.push({
                    deviceId: parseInt(data.deviceId),
                    areaId: parseInt(data.areaId),
                    status: data.status,
                    normalScore: parseFloat(data.normalScore),
                    name: data.name,
                    address: data.address,
                });
            }
        }

        return devices;
    }

    // 업데이트 로직
    async updateDevice(deviceId: number, updateData: Partial<DeviceDataInRedis>): Promise<void> {
        const deviceKey = `device:${deviceId}`;
        const exists = await this.redis.exists(deviceKey);

        if (!exists) {
            throw new Error("존재하지 않는 기기입니다.");
        }

        const hashData: Record<string, string> = {};
        if (updateData.areaId !== undefined) hashData.areaId = updateData.areaId.toString();
        if (updateData.status !== undefined) hashData.status = updateData.status;
        if (updateData.normalScore !== undefined) hashData.normalScore = updateData.normalScore.toString();
        if (updateData.name !== undefined) hashData.name = updateData.name;
        if (updateData.address !== undefined) hashData.address = updateData.address;

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