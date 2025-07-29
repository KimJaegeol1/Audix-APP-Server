export class CreateAreaDto {
    name: string;
    address: string;
    explain?: string;
    status?: string;
    image?: string;

    static to(dto: CreateAreaDto) {
        return {
            name: dto.name,
            address: dto.address,
            explain: dto.explain ?? null,
            status: dto.status ?? null,
            image: dto.image ?? null
        }
    }
}

export class CreateResultAreaDto {
    name: string
    isSuccess: boolean

    constructor(init: { name: string, isSuccess: boolean }) {
        this.name = init.name;
        this.isSuccess = init.isSuccess;
    }
}