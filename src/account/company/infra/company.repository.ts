import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/common/db/prisma.service";
import { Prisma, companys } from "@prisma/client";
import { CreateCompanyDto } from "../domain/dto/CreateCompanyDto";

@Injectable()
export class CompanyRepository {
    constructor(private readonly prisma: PrismaService) { }

    //---CREATE---
    async createCompany(createCompanyDto: CreateCompanyDto, tx: Prisma.TransactionClient = this.prisma): Promise<Boolean> {
        await tx.companys.create({
            data: CreateCompanyDto.to(createCompanyDto)
        });
        return true;
    }
    //---READ---
    async getCompanyById(id: number): Promise<companys | null> {
        const companyInfo = await this.prisma.companys.findUnique({
            where: { id: id },
        });
        return companyInfo;
    }
    async getAllCompany(page: number, limit: number): Promise<companys[]> {
        const companyList = await this.prisma.companys.findMany({
            skip: page * limit,
            take: limit,
        });
        return companyList;
    }
    //---UPDATE---
    async updateCompanyById(id: number, updateData: Partial<CreateCompanyDto>, tx: Prisma.TransactionClient = this.prisma): Promise<boolean> {
        await tx.companys.update({
            where: { id: id },
            data: updateData
        });
        return true;
    }
    //---DELETE---
    async deleteCompanyById(id: number, tx: Prisma.TransactionClient = this.prisma): Promise<Boolean> {
        await tx.companys.delete({
            where: { id: id }
        });

        return true;
    }
}