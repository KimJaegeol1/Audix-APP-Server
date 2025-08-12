import { Controller, Post, Get, Body, Param, Query, ParseIntPipe, DefaultValuePipe, Delete, UseInterceptors, UploadedFile, UseGuards, Request, HttpStatus, HttpCode } from "@nestjs/common";
import { CreateRequestDeviceDto } from "../dto/create-device.dto";
import { DeviceService, DeviceInRedisService } from "../../domain/service/device.service";
import { NUMBER_CONSTANTS } from "src/common/constants/number";
import { multerConfig } from "src/common/multer/multer.config";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";

@Controller('device')
export class DeviceController {
    constructor(
        private readonly deviceInRedisService: DeviceInRedisService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Get('list/:areaId')
    @HttpCode(HttpStatus.OK)
    async findListByAreaId(@Param('areaId', ParseIntPipe) areaId: number) {
        const result = await this.deviceInRedisService.findListByAreaId(areaId);

        return {
            statusCode: HttpStatus.OK,
            message: '디바이스 목록 조회 성공',
            data: result
        };
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const result = await this.deviceInRedisService.findOne(id);
        return {
            statusCode: HttpStatus.OK,
            message: '디바이스 조회 성공',
            data: result
        };
    }

}

@Controller('admin/device')
export class DeviceAdminController {
    constructor(
        private readonly deviceService: DeviceService
    ) { }

    //---CREATE---
    @Post('')
    @UseInterceptors(FileInterceptor('image', multerConfig))
    async create(
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
    async findListByAreaId(@Param('areaId', ParseIntPipe) areaId: number) {
        return this.deviceService.findListByAreaId(areaId);
    }
    @Get('all')
    async findAll(@Query('page', new DefaultValuePipe(NUMBER_CONSTANTS.DEFAULT_PAGE), ParseIntPipe) page: number, @Query('limit', new DefaultValuePipe(NUMBER_CONSTANTS.DEFAULT_LIMIT), ParseIntPipe) limit: number) {
        return this.deviceService.findAll(page, limit);
    }
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.deviceService.findOne(id);
    }
    //---UPDATE--- // 아직 미구현
    //---DELETE---
    @Delete('list/:areaId')
    async deleteListByAreaId(@Param('areaId', ParseIntPipe) areaId: number) {
        return this.deviceService.deleteListByAreaId(areaId);
    }
    @Delete('all')
    async deleteALL() {
        return this.deviceService.deleteALL();
    }
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return this.deviceService.delete(id);
    }

}

@Controller('admin/device/redis')
export class DeviceInRedisController {
    constructor(
        private readonly deviceInRedisService: DeviceInRedisService
    ) { }

    //---READ---
    @Get('all')
    async findAll() {
        return this.deviceInRedisService.findAll();
    }
    @Get('list/:areaId')
    async findListByAreaId(@Param('areaId', ParseIntPipe) areaId: number) {
        return this.deviceInRedisService.findListByAreaId(areaId);
    }
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.deviceInRedisService.findOne(id);
    }
    //---UPDATE--- // 아직 미구현
    //---DELETE---
    @Delete('all')
    async deleteALL() {
        return this.deviceInRedisService.deleteALL();
    }
    @Delete('list/:areaId')
    async deleteListByAreaId(@Param('areaId', ParseIntPipe) areaId: number) {
        return this.deviceInRedisService.deleteListByAreaId(areaId);
    }
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return this.deviceInRedisService.delete(id);
    }

}