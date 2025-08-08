import { Controller, Post, Get, Body, Param, Query, ParseIntPipe, DefaultValuePipe, Put, Delete } from "@nestjs/common";
import { CreateRequestUserDto } from "../dto/create-user.dto";
import { UserService } from "../../domain/service/user.service";
import { NUMBER_CONSTANTS } from "src/common/constants/number";

@Controller('admin/user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    //---CREATE---
    @Post('')
    create(@Body() createRequestUserDto: CreateRequestUserDto) {
        return this.userService.create(createRequestUserDto)
    }
    //---READ---
    @Get('all')
    findList(@Query('page', new DefaultValuePipe(NUMBER_CONSTANTS.DEFAULT_PAGE), ParseIntPipe) page: number, @Query('limit', new DefaultValuePipe(NUMBER_CONSTANTS.DEFAULT_LIMIT), ParseIntPipe) limit: number) {
        return this.userService.findAll(page, limit);
    }
    @Get("list/:teamId")
    findListByTeam(@Param('teamId', ParseIntPipe) teamId: number) {
        return this.userService.findListByTeamId(teamId);
    }
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.userService.findOne(id);
    }
    //---UPDATE---
    //---DELETE---
    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.userService.delete(id);
    }

}