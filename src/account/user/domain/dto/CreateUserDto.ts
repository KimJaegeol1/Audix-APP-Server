import { users } from "@prisma/client";

export class CreateUserDto {
    team_id?: number;
    login_code: string;
    password: string;
    name: string;
    email: string;
    phone: string;
    position: string;
    is_active?: boolean;
    refresh_token?: string;

    static to(dto: CreateUserDto) {
        return {
            team_id: dto.team_id ?? null,
            login_code: dto.login_code,
            password: dto.password,
            name: dto.name,
            email: dto.email,
            phone: dto.phone,
            position: dto.position,
            is_active: dto.is_active ?? null,
            refresh_token: dto.refresh_token ?? null
        }
    }
}