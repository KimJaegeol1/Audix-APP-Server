import { Controller, Post, Get, Body, Delete } from "@nestjs/common";
import { CreateRequestUserAreaDto } from "../dto/create-user_area.dto";
import { UserAreaService } from "../../domain/service/user_area.service";


@Controller('admin/user-area')
export class UserAreaController {
    constructor(private readonly userAreaService: UserAreaService) { }

    @Post('')
    create(@Body() createRequestUserAreaDto: CreateRequestUserAreaDto) {
        return this.userAreaService.create(createRequestUserAreaDto);
    }

    @Get('all')
    findAll() {
        return this.userAreaService.findAll();
    }

    @Delete('all')
    deleteAll() {
        return this.userAreaService.deleteAll();
    }
}