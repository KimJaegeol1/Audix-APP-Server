import { Controller, Post, Get, Body, Param, Query, ParseIntPipe } from "@nestjs/common";
import { CreateRequestUserDto } from "../dto/create-user.dto";
import { UserService } from "../../domain/service/user.service";

@Controller('admin/user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('')
    create(@Body() createRequestUserDto: CreateRequestUserDto) {
        return this.userService.create(createRequestUserDto)
    }
    @Get('list')
    findList(@Query('page', ParseIntPipe) page: number, @Query('limit', ParseIntPipe) limit: number) {
        return this.userService.findList(page, limit);
    }
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.userService.findOne(id);
    }


}