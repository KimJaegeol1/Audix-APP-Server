import { Controller, Post, Get, Body, Param, Query, ParseIntPipe, DefaultValuePipe, UseInterceptors, UploadedFile, Delete, UseGuards, Request, HttpStatus, HttpCode } from "@nestjs/common";
import { CreateRequestAreaDto } from "../dto/create-area.dto";
import { AreaService } from "../../domain/service/area.service";
import { NUMBER_CONSTANTS } from "src/common/constants/number";
import { multerConfig } from "src/common/multer/multer.config";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";

@Controller('area')
export class AreaController {
    constructor(private readonly areaService: AreaService) { }

    @UseGuards(JwtAuthGuard)
    @Get('list')
    @HttpCode(HttpStatus.OK)
    async findList(@Request() req) {
        const result = await this.areaService.findListByUserId(req.user.id);
        return {
            statusCode: HttpStatus.OK,
            message: '구역 목록 조회 성공',
            data: result
        };
    }
}

@Controller('admin/area')
export class AreaAdminController {
    constructor(private readonly areaService: AreaService) { }

    //---CREATE---
    @Post('')
    @UseInterceptors(FileInterceptor('image', multerConfig))
    async create(
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
    async findAll(@Query('page', new DefaultValuePipe(NUMBER_CONSTANTS.DEFAULT_PAGE), ParseIntPipe) page: number, @Query('limit', new DefaultValuePipe(NUMBER_CONSTANTS.DEFAULT_LIMIT), ParseIntPipe) limit: number) {
        return this.areaService.findAll(page, limit);
    }
    @Get('list/:userId')
    async findListByUserId(@Param('userId', ParseIntPipe) userId: number) {
        return this.areaService.findListByUserId(userId);
    }
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.areaService.findOne(id);
    }
    //---UPDATE---
    //---DELETE---
    @Delete('all')
    async deleteALL() {
        return this.areaService.deleteALL();
    }
    @Delete(':id')
    async deleteAreaById(@Param('id', ParseIntPipe) id: number) {
        return this.areaService.deleteListByUserId(id);
    }

}