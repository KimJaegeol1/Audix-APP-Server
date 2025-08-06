import { Controller, Post, Get, Body, Param, Query, ParseIntPipe, DefaultValuePipe, UseInterceptors, UploadedFile, Delete } from "@nestjs/common";
import { CreateRequestAreaDto } from "../dto/create-area.dto";
import { AreaService } from "../../domain/service/area.service";
import { NUMBER_CONSTANTS } from "src/common/constants/number";
import { multerConfig } from "src/common/multer/multer.config";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreateAreaDto } from "../../domain/dto/CreateAreaDto";

@Controller('admin/area')
export class AreaController {
    constructor(private readonly areaService: AreaService) { }

    //---CREATE---
    @Post('')
    @UseInterceptors(FileInterceptor('image', multerConfig))
    create(
        @Body() createRequestAreaDto: CreateRequestAreaDto, @UploadedFile() file: Express.Multer.File
    ) {
        // 이미지 파일이 업로드된 경우 경로를 저장
        if (file) {
            // public/images/파일명 형태로 상대 경로 저장
            const imagePath = `/images/${file.filename}`;
            createRequestAreaDto.image = imagePath;
        }

        return this.areaService.create(createRequestAreaDto)
    }
    //---READ---
    @Get('all')
    findAll(@Query('page', new DefaultValuePipe(NUMBER_CONSTANTS.DEFAULT_PAGE), ParseIntPipe) page: number, @Query('limit', new DefaultValuePipe(NUMBER_CONSTANTS.DEFAULT_LIMIT), ParseIntPipe) limit: number) {
        return this.areaService.findAll(page, limit);
    }
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.areaService.findOne(id);
    }
    @Get('list/user/:userId')
    findListByUserId(@Param('userId', ParseIntPipe) userId: number) {
        return this.areaService.findListByUserId(userId);
    }
    //---UPDATE---
    @Post(':id')
    updateAreaByAreaId(@Param('id', ParseIntPipe) id: number, @Body() updateData: Partial<CreateAreaDto>) {
        return this.areaService.updateAreaByAreaId(id, updateData);
    }
    //---DELETE---
    @Delete(':id')
    deleteAreaById(@Param('id', ParseIntPipe) id: number) {
        return this.areaService.deleteAreaByAreaId(id);
    }
    @Delete('all')
    deleteAreaALL() {
        return this.areaService.deleteAreaALL();
    }
}