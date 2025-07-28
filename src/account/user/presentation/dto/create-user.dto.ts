export class CreateRequestUserDto {
    teamId?: number;
    loginCode: string;
    password: string;
    name: string;
    email: string;
    phone: string;
    position: string;
    isActive?: boolean;
    refreshToken?: string;
}