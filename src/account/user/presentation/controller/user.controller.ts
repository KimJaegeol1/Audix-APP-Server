import { Controller, Post, Get, Body, Param } from "@nestjs/common";
import { CreateRequestUserDto } from "../dto/create-user.dto";
import { UserService } from "../../domain/service/user.service";

@Controller('admin/user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('')
    create(@Body() createRequestUserDto: CreateRequestUserDto) {
        return this.userService.create(createRequestUserDto)
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.userService.findOne(id);
    }

    @Get('list')
    findList(@Param('page') page: number, @Param('limit') limit: number) {
        return this.userService.findList(page, limit);
    }
}