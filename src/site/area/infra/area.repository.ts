import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/db/prisma.service";
import { Prisma, areas } from "@prisma/client";
import { CreateAreaDto } from "../domain/dto/CreateAreaDto";

@Injectable()
export class AreaRepository {
    constructor(private readonly prisma: PrismaService) { }

    async createArea(createAreaDto: CreateAreaDto, tx: Prisma.TransactionClient = this.prisma): Promise<Boolean> {
        const areaData = CreateAreaDto.to(createAreaDto);
        await tx.areas.create({
            data: areaData
        })
        return true;
    }

    async getAreaById(id: number): Promise<areas | null> {
        const areaInfo = await this.prisma.areas.findUnique({
            where: { id: id },
        })
        return areaInfo;
    }

    async getAreaList(page: number | 0, limit: number | 100): Promise<areas[]> {
        const areaList = await this.prisma.areas.findMany({
            skip: page * limit || 0,
            take: limit,
        });
        return areaList;
    }

}