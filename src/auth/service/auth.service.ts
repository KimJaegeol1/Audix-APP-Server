import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/common/db/prisma.service";
import * as bcrypt from 'bcrypt';
import { AuthPayload } from "../dto/auth.payload";

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService,
    ) { }

    async validateUser(loginCode: string, password: string) {
        const user = await this.prisma.users.findUnique({
            where: { login_code: loginCode },
        })

        if (user && user.is_active && await bcrypt.compare(password, user.password)) {
            return user;
        }
        return null;
    }
    o
    async login(user: any) {
        const payload = new AuthPayload();
        payload.id = user.id;

        const accessToken = this.jwtService.sign(
            payload,
            {
                secret: process.env.JWT_SECRET,
                expiresIn: '1h'
            }
        );
        const refreshToken = this.jwtService.sign(
            payload,
            {
                secret: process.env.JWT_REFRESH_SECRET,
                expiresIn: '7d'
            }
        );

        await this.prisma.users.update({
            where: { id: user.id },
            data: { refresh_token: refreshToken }
        })

        return {
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: user
        }
    }

    async refreshToken(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET,
            });

            const user = await this.prisma.users.findUnique({
                where: { id: payload.id }
            })

            if (!user || user.refresh_token !== refreshToken || !user.is_active) {
                throw new UnauthorizedException("잘못된 요청입니다.")
            }

            const newAccessToken = this.jwtService.sign(
                payload,
                {
                    secret: process.env.JWT_SECRET,
                    expiresIn: '1h'
                }
            );

            return {
                accessToken: newAccessToken,
                user: user
            }
        } catch (error) {
            throw new UnauthorizedException("잘못된 요청입니다.");
        }
    }

    async logout(userId: number) {
        await this.prisma.users.update({
            where: { id: userId },
            data: { refresh_token: null }
        })
        return { message: "로그아웃 성공" }
    }
}