export class CreateDeviceInRedisDto {
    deviceId: number;
    areaId?: number;
    name: string;
    model: string;
    address: string;
    deviceManager: string;
    parts: object;
    normalScore: number;
    image?: string;
    status?: string;
}