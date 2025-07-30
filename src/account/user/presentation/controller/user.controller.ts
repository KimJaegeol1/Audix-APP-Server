import { Controller, Post, Get, Body, Param, Query, ParseIntPipe, DefaultValuePipe } from "@nestjs/common";
import { CreateRequestUserDto } from "../dto/create-user.dto";
import { UserService } from "../../domain/service/user.service";
import { NUMBER_CONSTANTS } from "src/common/constants/number";

@Controller('admin/user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('')
    create(@Body() createRequestUserDto: CreateRequestUserDto) {
        return this.userService.create(createRequestUserDto)
    }
    @Get('list')
    findList(@Query('page', new DefaultValuePipe(NUMBER_CONSTANTS.DEFAULT_PAGE), ParseIntPipe) page: number, @Query('limit', new DefaultValuePipe(NUMBER_CONSTANTS.DEFAULT_LIMIT), ParseIntPipe) limit: number) {
        return this.userService.findList(page, limit);
    }
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.userService.findOne(id);
    }


}