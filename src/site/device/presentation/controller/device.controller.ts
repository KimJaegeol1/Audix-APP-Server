import { Controller, Post, Get, Body, Param, Query, ParseIntPipe, DefaultValuePipe } from "@nestjs/common";
import { CreateRequestDeviceDto } from "../dto/create-device.to";
import { DeviceService } from "../../domain/service/device.service";
import { NUMBER_CONSTANTS } from "src/common/constants/number";

@Controller('admin/device')
export class DeviceController {
    constructor(private readonly deviceService: DeviceService) { }

    @Post('')
    create(@Body() createRequestDeviceDto: CreateRequestDeviceDto) {
        return this.deviceService.create(createRequestDeviceDto);
    }
    @Get('list')
    findAll(@Query('page', new DefaultValuePipe(NUMBER_CONSTANTS.DEFAULT_PAGE), ParseIntPipe) page: number, @Query('limit', new DefaultValuePipe(NUMBER_CONSTANTS.DEFAULT_LIMIT), ParseIntPipe) limit: number) {
        return this.deviceService.findList(page, limit);
    }
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.deviceService.findOne(id);
    }


}