export class CreateTeamDto {
    companyId?: number;
    explain?: string;
    name: string;

    static to(dto: CreateTeamDto) {
        return {
            company_id: dto.companyId,
            explain: dto.explain,
            name: dto.name
        }
    }
}

export class CreateResultTeamDto {
    name: string;
    isSuccess: boolean;

    constructor(init: { name: string, isSuccess: boolean }) {
        this.name = init.name;
        this.isSuccess = init.isSuccess;
    }
}