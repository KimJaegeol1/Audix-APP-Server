import { Controller, Post, Get, Body, Param, Query, ParseIntPipe, DefaultValuePipe, Delete, UseInterceptors, UploadedFile } from "@nestjs/common";
import { CreateRequestCompanyDto } from "../dto/create-compnay.dto";
import { CompanyService } from "../../domain/service/company.service";
import { NUMBER_CONSTANTS } from "src/common/constants/number";

@Controller('admin/company')
export class CompanyController {
    constructor(private readonly companyService: CompanyService) { }

    //---CREATE---
    @Post('')
    create(@Body() createRequestCompanyDto: CreateRequestCompanyDto) {
        return this.companyService.create(createRequestCompanyDto);
    }
    //---READ---
    @Get('all')
    findAll(@Query('page', new DefaultValuePipe(NUMBER_CONSTANTS.DEFAULT_PAGE), ParseIntPipe) page: number, @Query('limit', new DefaultValuePipe(NUMBER_CONSTANTS.DEFAULT_LIMIT), ParseIntPipe) limit: number) {
        return this.companyService.findAll(page, limit);
    }
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.companyService.findOne(id);
    }
    //---UPDATE---
    //---DELETE---
    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.companyService.delete(id);
    }
}