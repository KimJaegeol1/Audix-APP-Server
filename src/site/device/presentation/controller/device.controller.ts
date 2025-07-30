import { Controller, Post, Get, Body, Param, Query, ParseIntPipe } from "@nestjs/common";
import { CreateRequestDeviceDto } from "../dto/create-device.to";
import { DeviceService } from "../../domain/service/device.service";

@Controller('admin/device')
export class DeviceController {
    constructor(private readonly deviceService: DeviceService) { }

    @Post('')
    create(@Body() createRequestDeviceDto: CreateRequestDeviceDto) {
        return this.deviceService.create(createRequestDeviceDto);
    }
    @Get('list')
    findAll(@Query('page', ParseIntPipe) page: number, @Query('limit', ParseIntPipe) limit: number) {
        return this.deviceService.findList(page, limit);
    }
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.deviceService.findOne(id);
    }


}