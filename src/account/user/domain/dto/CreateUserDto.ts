export class CreateUserDto {
    teamId?: number;
    loginCode: string;
    password: string;
    name: string;
    email: string;
    phone: string;
    position: string;
    isActive?: boolean;
    refreshToken?: string;

    static to(dto: CreateUserDto) {
        return {
            team_id: dto.teamId ?? null,
            login_code: dto.loginCode,
            password: dto.password,
            name: dto.name,
            email: dto.email,
            phone: dto.phone,
            position: dto.position,
            is_active: dto.isActive ?? null,
            refresh_token: dto.refreshToken ?? null
        }
    }
}

export class CreateResultUserDto {
    loginCode: string
    isSuccess: boolean

    constructor(init: { loginCode: string; isSuccess: boolean }) {
        this.loginCode = init.loginCode;
        this.isSuccess = init.isSuccess
    }
}