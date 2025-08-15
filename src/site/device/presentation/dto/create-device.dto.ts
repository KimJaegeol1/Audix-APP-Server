export class CreateRequestDeviceDto {
    areaId?: number;
    name: string;
    model: string;
    deviceManager: string;
    address: string;
    explain?: string;
    status?: string;
    image?: string;
    parts: string; // form-data로 전송 시 문자열로 받음
}