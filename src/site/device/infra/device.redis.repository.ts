import { Injectable } from "@nestjs/common";
import { InjectRedis } from "@nestjs-modules/ioredis";
import Redis from "ioredis";

export interface DeviceDataInRedis {
    deviceId: number;
    areaId?: number;
    explain: string;
    name: string;
    address: string;
    status: string;
    deviceManager?: string;
    image?: string;
    normalScore: number;
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
            explain: deviceDataInRedis.explain,
            name: deviceDataInRedis.name,
            address: deviceDataInRedis.address,
            status: deviceDataInRedis.status,
            deviceManager: deviceDataInRedis.deviceManager || "",
            image: deviceDataInRedis.image || "",
            normalScore: deviceDataInRedis.normalScore.toString(),
        }

        await this.redis.hset(deviceKey, hashData);
    }

    // 모든 기기 조회
    async getDeviceList(): Promise<DeviceDataInRedis[]> {
        const keys = await this.redis.keys("device:*");
        const devices: DeviceDataInRedis[] = [];

        for (const key of keys) {
            const data = await this.redis.hgetall(key);
            if (data) {
                devices.push({
                    deviceId: parseInt(data.deviceId),
                    areaId: data.areaId ? parseInt(data.areaId) : undefined,
                    explain: data.explain,
                    name: data.name,
                    address: data.address,
                    status: data.status,
                    deviceManager: data.deviceManager || "",
                    image: data.image || "",
                    normalScore: parseFloat(data.normalScore),
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
            explain: data.explain,
            name: data.name,
            address: data.address,
            status: data.status,
            deviceManager: data.deviceManager || "",
            image: data.image || "",
            normalScore: parseFloat(data.normalScore),
        };
    }

    // areaId로 기기 조회
    async getDeviceListByAreaId(areaId: number): Promise<DeviceDataInRedis[]> {
        const keys = await this.redis.keys(`device:*`);
        const devices: DeviceDataInRedis[] = [];

        for (const key of keys) {
            const data = await this.redis.hgetall(key);
            if (data && data.areaId && parseInt(data.areaId) === areaId) {
                devices.push({
                    deviceId: parseInt(data.deviceId),
                    areaId: parseInt(data.areaId),
                    explain: data.explain,
                    name: data.name,
                    address: data.address,
                    status: data.status,
                    deviceManager: data.deviceManager || "",
                    image: data.image || "",
                    normalScore: parseFloat(data.normalScore),
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
        if (updateData.deviceManager !== undefined) hashData.deviceManager = updateData.deviceManager;
        if (updateData.image !== undefined) hashData.image = updateData.image;

        await this.redis.hset(deviceKey, hashData);
    }

    // 디바이스 아이디로 디바이스 삭제
    async deleteDeviceByDeviceId(deviceId: number): Promise<void> {
        const deviceKey = `device:${deviceId}`;
        const exists = await this.redis.exists(deviceKey);

        if (!exists) {
            throw new Error("존재하지 않는 기기입니다.");
        }

        await this.redis.del(deviceKey)
    }

    // 전체 디바이스 삭제
    async deleteAllDevices(): Promise<void> {
        const keys = await this.redis.keys("device:*");
        if (keys.length > 0) {
            await this.redis.del(keys);
        }
    }
}