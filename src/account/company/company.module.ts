import { Module } from "@nestjs/common";
import { CompanyController } from "./presentation/controller/company.controller";
import { CompanyService } from "./domain/service/company.service";
import { CompanyRepository } from "./infra/company.repository";
import { PrismaModule } from "src/common/db/prisma.module";

@Module({
    imports: [PrismaModule],
    controllers: [CompanyController],
    providers: [CompanyService, CompanyRepository],
})
export class CompanyModule { }
