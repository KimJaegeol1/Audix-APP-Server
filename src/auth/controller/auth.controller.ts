import {
    Controller,
    Post,
    UseGuards,
    Request,
    Body,
    UnauthorizedException,
    HttpStatus,
    HttpCode
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { LoginDto, RefreshTokenDto } from '../dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Request() req, @Body() loginDto: LoginDto) {
        const result = await this.authService.login(req.user);

        return {
            statusCode: HttpStatus.OK,
            message: '로그인 성공',
            data: result
        }
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
        try {
            const result = await this.authService.refreshToken(refreshTokenDto.refreshToken)

            return {
                statusCode: HttpStatus.OK,
                message: "액세스 토큰 재발급 성공",
                data: result
            }
        } catch (error) {
            throw new UnauthorizedException("refresh token이 유효하지 않습니다.")
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout(@Request() req) {
        await this.authService.logout(req.user.id);

        return {
            statusCode: HttpStatus.OK,
            message: "로그아웃 성공"
        }
    }
}