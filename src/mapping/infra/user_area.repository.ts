import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/db/prisma.service";
import { Prisma, user_area } from "@prisma/client"
import { CreateUserAreaDto } from "../domain/dto/CreateUserAreaDto";

@Injectable()
export class UserAreaRepository {
    constructor(private readonly prisma: PrismaService) { }

    async createUserArea(createUserAreaDto: CreateUserAreaDto, tx: Prisma.TransactionClient = this.prisma): Promise<Boolean> {
        const userAreaMappingData = CreateUserAreaDto.to(createUserAreaDto);
        await tx.user_area.create({
            data: userAreaMappingData
        });
        return true;
    }

    async getInfoByUserId(userId: number): Promise<user_area[]> {
        const userAreaInfo = await this.prisma.user_area.findMany({
            where: { user_id: userId },
        });
        return userAreaInfo;
    }

}