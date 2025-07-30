import { Controller, Post, Get, Body, Param, Query } from "@nestjs/common";
import { CreateRequestDeviceDto } from "../dto/create-device.to";
import { DeviceService } from "../../domain/service/device.service";

@Controller('admin/device')
export class DeviceController {
    constructor(private readonly deviceService: DeviceService) { }

    @Post('')
    create(@Body() createRequestDeviceDto: CreateRequestDeviceDto) {
        return this.deviceService.create(createRequestDeviceDto);
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.deviceService.findOne(id);
    }

    @Get('list')
    findAll(@Query('page') page: number, @Query('limit') limit: number) {
        return this.deviceService.findList(page, limit);
    }
}