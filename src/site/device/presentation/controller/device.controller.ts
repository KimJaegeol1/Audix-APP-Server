import { Controller, Post, Get, Body, Param, Query, ParseIntPipe, DefaultValuePipe } from "@nestjs/common";
import { CreateRequestDeviceDto } from "../dto/create-device.dto";
import { DeviceService, DeviceInRedisService } from "../../domain/service/device.service";
import { NUMBER_CONSTANTS } from "src/common/constants/number";
import { DeviceDataInRedis } from "../../infra/device.redis.repository";


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
    @Get('list/area/:areaId')
    findListByAreaId(@Param('areaId', ParseIntPipe) areaId: number) {
        return this.deviceService.findListByAreaId(areaId);
    }
}

@Controller('admin/device/redis')
export class DeviceInRedisController {
    constructor(
        private readonly deviceInRedisService: DeviceInRedisService
    ) { }

    @Post('')
    createDeviceInRedis(@Body() deviceDataInRedis: DeviceDataInRedis) {
        return this.deviceInRedisService.createDeviceInRedis(deviceDataInRedis);
    }
    @Get('all')
    findAllDevicesFromRedis() {
        return this.deviceInRedisService.findAllDevicesInRedis();
    }
    @Get('area/:areaId')
    findDeviceListFromRedisByAreaId(@Param('areaId', ParseIntPipe) areaId: number) {
        return this.deviceInRedisService.findDeviceListInRedisByAreaId(areaId);
    }
    @Get(':deviceId')
    findDeviceFromRedisByDeviceId(@Param('deviceId', ParseIntPipe) deviceId: number) {
        return this.deviceInRedisService.findDeviceInRedisByDeviceId(deviceId);
    }



}