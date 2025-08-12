export class SearchLoginCodeDto {
    name: string;
    email: string;
    phone: string;

    static to(dto: SearchLoginCodeDto) {
        return {
            name: dto.name,
            email: dto.email,
            phone: dto.phone,
        }
    }
}

export class SearchResultLoginCodeDto {
    loginCode: String
    isSuccess: boolean

    constructor(init: { loginCode: string, isSuccess: boolean }) {
        this.loginCode = init.loginCode;
        this.isSuccess = init.isSuccess
    }
}