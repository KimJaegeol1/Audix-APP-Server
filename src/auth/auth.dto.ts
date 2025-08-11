import { IsString, IsNotEmpty, Length } from "class-validator";

export class LoginDto {
    @IsString()
    @IsNotEmpty()
    @Length(6, 6, { message: '로그인 코드는 6자리여야 합니다.' })
    loginCode: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

export class RefreshTokenDto {
    @IsString()
    @IsNotEmpty()
    refreshToken: string;
}