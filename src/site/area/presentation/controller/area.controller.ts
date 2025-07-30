import { Controller, Post, Get, Body, Param, Query, ParseIntPipe } from "@nestjs/common";
import { CreateRequestAreaDto } from "../dto/create-area.dto";
import { AreaService } from "../../domain/service/area.service";

@Controller('admin/area')
export class AreaController {
    constructor(private readonly areaService: AreaService) { }

    @Post('')
    create(@Body() createRequestAreaDto: CreateRequestAreaDto) {
        return this.areaService.create(createRequestAreaDto)
    }
    @Get('list')
    findAll(@Query('page', ParseIntPipe) page: number, @Query('limit', ParseIntPipe) limit: number) {
        return this.areaService.findList(page, limit);
    }
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.areaService.findOne(id);
    }


}