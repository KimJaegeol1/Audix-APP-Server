import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { ConfigService } from "@nestjs/config";

@Module({
    providers: [PrismaService, ConfigService],
    exports: [PrismaService]
})

export class PrismaModule { }