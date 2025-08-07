export class CreateCompanyDto {
    name: string;
    address: string;
    explain?: string;

    static to(dto: CreateCompanyDto) {
        return {
            name: dto.name,
            address: dto.address,
            explain: dto.explain ?? null
        }
    }
}

export class createResultCompanyDto {
    name: string
    isSuccess: boolean

    constructor(init: { name: string, isSuccess: boolean }) {
        this.name = init.name;
        this.isSuccess = init.isSuccess;
    }
}