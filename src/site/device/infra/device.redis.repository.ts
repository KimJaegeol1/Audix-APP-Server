import { Injectable } from "@nestjs/common";
import { InjectRedis } from "@nestjs-modules/ioredis";
import Redis from "ioredis";
import { CreateDeviceInRedisDto } from "../domain/dto/CreateDeviceInRedisDto";

@Injectable()
export class DeviceInRedisRepository {
    constructor(@InjectRedis() private readonly redis: Redis) { }

    //---CREATE---
    async createDevice(createDeviceInRedisDto: CreateDeviceInRedisDto): Promise<Boolean> {
        const deviceKey = `device:${createDeviceInRedisDto.deviceId}`;
        await this.redis.hset(deviceKey, createDeviceInRedisDto);

        return true
    }
    //---READ---
    async getDeviceListAll(): Promise<CreateDeviceInRedisDto[]> {
        const keys = await this.redis.keys("device:*");
        const deviceList: CreateDeviceInRedisDto[] = [];

        for (const key of keys) {
            const data = await this.redis.hgetall(key);
            if (data) {
                deviceList.push({
                    deviceId: parseInt(data.deviceId),
                    areaId: data.areaId ? parseInt(data.areaId) : undefined,
                    name: data.name,
                    model: data.model,
                    address: data.address,
                    deviceManager: data.deviceManager || "",
                    parts: JSON.parse(data.parts || '{}'),
                    normalScore: parseFloat(data.normalScore),
                    image: data.image,
                    status: data.status,
                });
            }
        }

        return deviceList;
    }
    async getDeviceByDeviceId(id: number): Promise<CreateDeviceInRedisDto | null> {
        const deviceKey = `device:${id}`;
        const data = await this.redis.hgetall(deviceKey);

        if (!data || Object.keys(data).length === 0) {
            return null;
        }

        return {
            deviceId: parseInt(data.deviceId),
            areaId: data.areaId ? parseInt(data.areaId) : undefined,
            name: data.name,
            model: data.model,
            address: data.address,
            deviceManager: data.deviceManager || "",
            parts: JSON.parse(data.parts || '{}'),
            normalScore: parseFloat(data.normalScore),
            image: data.image,
            status: data.status,
            aiText: data.aiText,
        };
    }
    async getDeviceListByAreaId(areaId: number): Promise<CreateDeviceInRedisDto[]> {
        const keys = await this.redis.keys(`device:*`);
        const deviceList: CreateDeviceInRedisDto[] = [];

        for (const key of keys) {
            const data = await this.redis.hgetall(key);
            if (data && data.areaId && parseInt(data.areaId) === areaId) {
                deviceList.push({
                    deviceId: parseInt(data.deviceId),
                    areaId: data.areaId ? parseInt(data.areaId) : undefined,
                    name: data.name,
                    model: data.model,
                    address: data.address,
                    deviceManager: data.deviceManager || "",
                    parts: JSON.parse(data.parts || '{}'),
                    normalScore: parseFloat(data.normalScore),
                    image: data.image,
                    status: data.status,
                    aiText: data.aiText,
                });
            }
        }

        return deviceList;
    }
    //---UPDATE---
    async updateDevice(id: number, updateData: Partial<CreateDeviceInRedisDto>): Promise<Boolean> {
        const deviceKey = `device:${id}`;
        const exists = await this.redis.exists(deviceKey);
        // 아직 미구현

        return true
    }
    //---DELETE---
    async deleteDeviceByDeviceId(id: number): Promise<Boolean> {
        const deviceKey = `device:${id}`;
        await this.redis.del(deviceKey)

        return true
    }
    async deleteDeviceByAreaId(areaId: number): Promise<Boolean> {
        const keys = await this.redis.keys(`device:*`);
        for (const key of keys) {
            const data = await this.redis.hgetall(key);
            if (data && data.areaId && parseInt(data.areaId) === areaId) {
                await this.redis.del(key);
            }
        }

        return true;
    }
    async deleteDeviceALL(): Promise<Boolean> {
        const keys = await this.redis.keys("device:*");
        if (keys.length > 0) {
            await this.redis.del(keys);
        }

        return true;
    }
}