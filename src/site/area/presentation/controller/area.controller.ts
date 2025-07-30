import { Controller, Post, Get, Body, Param, Query, ParseIntPipe, DefaultValuePipe } from "@nestjs/common";
import { CreateRequestAreaDto } from "../dto/create-area.dto";
import { AreaService } from "../../domain/service/area.service";
import { NUMBER_CONSTANTS } from "src/common/constants/number";

@Controller('admin/area')
export class AreaController {
    constructor(private readonly areaService: AreaService) { }

    @Post('')
    create(@Body() createRequestAreaDto: CreateRequestAreaDto) {
        return this.areaService.create(createRequestAreaDto)
    }
    @Get('list')
    findAll(@Query('page', new DefaultValuePipe(NUMBER_CONSTANTS.DEFAULT_PAGE), ParseIntPipe) page: number, @Query('limit', new DefaultValuePipe(NUMBER_CONSTANTS.DEFAULT_LIMIT), ParseIntPipe) limit: number) {
        return this.areaService.findList(page, limit);
    }
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.areaService.findOne(id);
    }
    @Get('list/user/:userId')
    findListByUserId(@Param('userId', ParseIntPipe) userId: number) {
        return this.areaService.findListByUserId(userId);
    }
}