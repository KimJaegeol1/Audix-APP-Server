import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/db/prisma.service";
import { Prisma, areas } from "@prisma/client";
import { CreateAreaDto } from "../domain/dto/CreateAreaDto";

@Injectable()
export class AreaRepository {
    constructor(private readonly prisma: PrismaService) { }

    //---CREATE---
    async createArea(createAreaDto: CreateAreaDto, tx: Prisma.TransactionClient = this.prisma): Promise<Boolean> {
        await tx.areas.create({
            data: CreateAreaDto.to(createAreaDto)
        })
        return true;
    }
    //---READ---
    async getAreaById(id: number): Promise<areas | null> {
        const areaInfo = await this.prisma.areas.findUnique({
            where: { id: id },
        })
        return areaInfo;
    }
    async getAreaListAll(page: number, limit: number): Promise<areas[]> {
        const areaList = await this.prisma.areas.findMany({
            skip: page * limit,
            take: limit,
        });
        return areaList;
    }
    async getAreaListByUserId(userId: number): Promise<areas[]> {
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
    //---UPDATE---
    async updateAreaByAreaId(id: number, updateData: Partial<CreateAreaDto>): Promise<Boolean> {
        await this.prisma.areas.update({
            where: { id: id },
            data: updateData
        });
        return true;
    }
    //---DELETE---
    async deleteAreaByAreaId(id: number): Promise<Boolean> {
        await this.prisma.areas.delete({
            where: { id: id }
        });
        return true;
    }
    async deleteAreaByUserId(userId: number): Promise<Boolean> {
        await this.prisma.areas.deleteMany({
            where: {
                user_area: {
                    some: {
                        user_id: userId
                    }
                }
            }
        });
        return true;
    }
    async deleteAreaAll(): Promise<Boolean> {
        await this.prisma.areas.deleteMany();
        return true;
    }

}