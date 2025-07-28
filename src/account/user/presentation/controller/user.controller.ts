import { Controller, Post, Get, Body, Param } from "@nestjs/common";
import { CreateRequestUserDto } from "../dto/create-user.dto";

@Controller('admin/user')
export class UserController {
    constructor() { }

    @Post('register')
    create(@Body() createRequestUserDto: CreateRequestUserDto) {

    }

    @Get(':id')
    findOne(@Param('id') id: String) {

    }
}