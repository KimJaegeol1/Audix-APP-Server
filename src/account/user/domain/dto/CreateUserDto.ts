export class CreateUserDto {
    teamId?: number;
    loginCode: string;
    password: string;
    name: string;
    email: string;
    phone: string;
    position: string;

    static to(dto: CreateUserDto) {
        return {
            team_id: dto.teamId ?? null,
            login_code: dto.loginCode,
            password: dto.password,
            name: dto.name,
            email: dto.email,
            phone: dto.phone,
            position: dto.position,
        }
    }
}

export class CreateResultUserDto {
    loginCode: String
    isSuccess: boolean

    constructor(init: { loginCode: string, isSuccess: boolean }) {
        this.loginCode = init.loginCode;
        this.isSuccess = init.isSuccess
    }
}