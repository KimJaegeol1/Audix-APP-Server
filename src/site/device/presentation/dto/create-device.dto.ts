export class CreateRequestDeviceDto {
    areaId?: number;
    name: string;
    address: string;
    explain?: string;
    status?: string;
    image?: string;
    parts: string[]
}