import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/common/db/prisma.service";
import { CreateRequestCompanyDto } from "../../presentation/dto/create-compnay.dto";
import { createResultCompanyDto, CreateCompanyDto } from "../dto/CreateCompanyDto";
import { CompanyRepository } from "../../infra/company.repository";

@Injectable()
export class CompanyService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly companyRepository: CompanyRepository
    ) { }

    //---CREATE---
    async create(createRequestCompanyDto: CreateRequestCompanyDto): Promise<createResultCompanyDto> {
        const { name, address, explain } = createRequestCompanyDto;
        // 제약조건 검사해야함
        // 트랜잭션 시작
        const result: boolean = await this.prisma.$transaction(async (tx) => {
            const createCompanyDto = new CreateCompanyDto();
            createCompanyDto.name = name;
            createCompanyDto.address = address;
            createCompanyDto.explain = explain;

            await this.companyRepository.createCompany(createCompanyDto, tx);

            return true;
        })

        return new createResultCompanyDto({
            name: name,
            isSuccess: result
        })
    }
    //---READ---
    async findOne(id: number): Promise<object> {
        const company = await this.companyRepository.getCompanyById(id);

        if (!company) {
            throw new NotFoundException(`해당하는 회사가 없습니다. ID: ${id}`);
        }

        return company;
    }
    async findAll(page: number, limit: number): Promise<object[]> {
        const companyList = await this.companyRepository.getAllCompany(page, limit);
        return companyList;
    }
    //---UPDATE---
    async update(id: number, updateData: Partial<CreateCompanyDto>): Promise<object> {
        const result = await this.companyRepository.updateCompanyById(id, updateData);
        return result;
    }
    //---DELETE---
    async delete(id: number): Promise<boolean> {
        const result = await this.companyRepository.deleteCompanyById(id);
        return true;
    }
}