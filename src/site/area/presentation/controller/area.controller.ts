import { Controller, Post, Get, Body, Param, Query } from "@nestjs/common";
import { CreateRequestAreaDto } from "../dto/create-area.dto";
import { AreaService } from "../../domain/service/area.service";

@Controller('admin/area')
export class AreaController {
    constructor(private readonly areaService: AreaService) { }

    @Post('')
    create(@Body() createRequestAreaDto: CreateRequestAreaDto) {
        return this.areaService.create(createRequestAreaDto)
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.areaService.findOne(id);
    }

    @Get('list')
    findAll(@Query('page') page: number, @Query('limit') limit: number) {
        return this.areaService.findList(page, limit);
    }
}