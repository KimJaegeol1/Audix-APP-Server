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

    async getAreaList(page: number, limit: number): Promise<areas[]> {
        const areaList = await this.prisma.areas.findMany({
            skip: page * limit,
            take: limit,
        });
        return areaList;
    }

    async getAreasByUserId(userId: number): Promise<areas[]> {
        const areas = await this.prisma.areas.findMany({
            where: {
                user_area: {
                    some: {
                        user_id: userId
                    }
                }
            }
        });
        return areas;
    }

    async deleteAreaALL(): Promise<Boolean> {
        await this.prisma.areas.deleteMany();
        return true;
    }

}