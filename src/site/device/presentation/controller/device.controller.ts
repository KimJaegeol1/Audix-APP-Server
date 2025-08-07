import { Controller, Post, Get, Body, Param, Query, ParseIntPipe, DefaultValuePipe, Delete, UseInterceptors, UploadedFile } from "@nestjs/common";
import { CreateRequestDeviceDto } from "../dto/create-device.dto";
import { DeviceService, DeviceInRedisService } from "../../domain/service/device.service";
import { NUMBER_CONSTANTS } from "src/common/constants/number";
import { DeviceInRedisRepository } from "../../infra/device.redis.repository";
import { multerConfig } from "src/common/multer/multer.config";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreateDeviceInRedisDto } from "../../domain/dto/CreateDeviceInRedisDto";

@Controller('admin/device')
export class DeviceController {
    constructor(
        private readonly deviceService: DeviceService
    ) { }

    //---CREATE---
    @Post('')
    @UseInterceptors(FileInterceptor('image', multerConfig))
    create(
        @Body() createRequestDeviceDto: CreateRequestDeviceDto,
        @UploadedFile() file: Express.Multer.File
    ) {
        if (file) {
            const imagePath = `/images/${file.filename}`;
            createRequestDeviceDto.image = imagePath;
        }

        return this.deviceService.create(createRequestDeviceDto);
    }
    //---READ---
    @Get('list/:areaId')
    findListByAreaId(@Param('areaId', ParseIntPipe) areaId: number) {
        return this.deviceService.findListByAreaId(areaId);
    }
    @Get('all')
    findAll(@Query('page', new DefaultValuePipe(NUMBER_CONSTANTS.DEFAULT_PAGE), ParseIntPipe) page: number, @Query('limit', new DefaultValuePipe(NUMBER_CONSTANTS.DEFAULT_LIMIT), ParseIntPipe) limit: number) {
        return this.deviceService.findAll(page, limit);
    }
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.deviceService.findOne(id);
    }
    //---UPDATE--- // 아직 미구현
    //---DELETE---
    @Delete('list/:areaId')
    delteListByAreaId(@Param('areaId', ParseIntPipe) areaId: number) {
        return this.deviceService.delteListByAreaId(areaId);
    }
    @Delete('all')
    deleteALL() {
        return this.deviceService.deleteALL();
    }
    @Delete('/list/:areaId')
    deleteListByAreaId(@Param('areaId', ParseIntPipe) areaId: number) {
        return this.deviceService.deleteListByAreaId(areaId);
    }
    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.deviceService.delete(id);
    }

}

@Controller('admin/device/redis')
export class DeviceInRedisController {
    constructor(
        private readonly deviceInRedisService: DeviceInRedisService
    ) { }

    //---CREATE---
    @Post('')
    createDeviceInRedis(@Body() deviceDataInRedis: DeviceDataInRedis) {
        return this.deviceInRedisService.createDeviceInRedis(deviceDataInRedis);
    }
    //---READ---
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
    //---DELETE---
    @Delete('all')
    deleteAllDevicesInRedis() {
        return this.deviceInRedisService.deleteDeviceInRedisAll();
    }
    @Delete(':deviceId')
    deleteDeviceInRedisByDeviceId(@Param('deviceId', ParseIntPipe) deviceId: number) {
        return this.deviceInRedisService.deleteDeviceInRedisByDeviceId(deviceId);
    }

}