export class CreateDeviceDto {
    areaId?: number;
    name: string;
    address: string;
    explain?: string;
    status?: string;
    image?: string;

    static to(dto: CreateDeviceDto) {
        return {
            area_id: dto.areaId ?? null,
            name: dto.name,
            address: dto.address,
            explain: dto.explain ?? null,
            status: dto.status ?? null,
            image: dto.image ?? null
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