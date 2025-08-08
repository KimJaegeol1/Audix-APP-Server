import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/db/prisma.service";
import { Prisma, teams } from "@prisma/client";
import { CreateTeamDto } from "../domain/dto/CreateTeamDto";

@Injectable()
export class TeamRepository {
    constructor(private readonly prisma: PrismaService) { }

    //---CREATE---
    async createTeam(createTeamDto: CreateTeamDto, tx: Prisma.TransactionClient = this.prisma): Promise<Boolean> {
        await tx.teams.create({
            data: CreateTeamDto.to(createTeamDto)
        });
        return true;
    }
    //---READ---
    async getTeamById(id: number): Promise<teams | null> {
        const teamInfo = await this.prisma.teams.findUnique({
            where: { id: id },
        });
        return teamInfo;
    }
    async getAllTeam(page: number, limit: number): Promise<teams[]> {
        const teamList = await this.prisma.teams.findMany({
            skip: page * limit,
            take: limit,
        });
        return teamList;
    }
    async getTeamByCompanyId(companyId: number): Promise<teams[]> {
        const teamList = await this.prisma.teams.findMany({
            where: { company_id: companyId },
        });
        return teamList;
    }
    //---UPDATE---
    async update(id: number, updateData: Partial<CreateTeamDto>, tx: Prisma.TransactionClient = this.prisma): Promise<boolean> {
        await tx.teams.update({
            where: { id: id },
            data: updateData
        });

        return true;
    }
    //---DELETE---
    async delete(id: number, tx: Prisma.TransactionClient = this.prisma): Promise<Boolean> {
        await tx.teams.delete({
            where: { id: id }
        });

        return true;
    }
}