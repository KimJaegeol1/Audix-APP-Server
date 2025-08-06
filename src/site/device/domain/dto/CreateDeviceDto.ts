export class CreateDeviceDto {
    areaId?: number;
    name: string;
    model: string;
    deviceManager: string;
    address: string;
    explain?: string;
    status?: string;
    image?: string;
    parts: string[];

    static to(dto: CreateDeviceDto) {
        console.log('🔍 DTO areaId:', dto.areaId, typeof dto.areaId);
        return {
            areaId: dto.areaId ? Number(dto.areaId) : undefined, // areaId를 number로 변환
            name: dto.name,
            model: dto.model,
            deviceManager: dto.deviceManager,
            address: dto.address,
            explain: dto.explain ?? null,
            status: dto.status ?? null,
            image: dto.image ?? null,
            parts: dto.parts ?? []
        }
    }
}
export class CreateResultDeviceDto {
    name: string;
    isSuccess: boolean;

    constructor(init: { name: string, isSuccess: boolean }) {
        this.name = init.name;
        this.isSuccess = init.isSuccess;
    }
}