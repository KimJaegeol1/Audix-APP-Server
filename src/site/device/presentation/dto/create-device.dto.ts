export class CreateRequestDeviceDto {
    areaId?: number;
    name: string;
    model: string;
    deviceManager: string;
    address: string;
    explain?: string;
    status?: string;
    image?: string;
    parts: string[]
}