import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./service/auth.service";
import { AuthController } from "./controller/auth.controller";
import { JwtStrategy } from "./strategies/jwt.startegy";
import { LocalStrategy } from "./strategies/local.strategy";
import { PrismaService } from "src/common/db/prisma.service";

@Module({
    imports: [PassportModule, JwtModule],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy, PrismaService]
})

export class AuthModule { }