import { Controller, Post, Get, Body, Param, Query, ParseIntPipe, DefaultValuePipe, Put, Delete } from "@nestjs/common";
import { CreateRequestUserDto } from "../dto/create-user.dto";
import { UserService } from "../../domain/service/user.service";
import { NUMBER_CONSTANTS } from "src/common/constants/number";
import { SearchhLoginCodeRequestDto } from "../dto/search-user.dto";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get('search/login-code')
    searchLoginCode(@Body() searchhLoginCodeRequestDto: SearchhLoginCodeRequestDto) {
        return this.userService.findLoginCode(searchhLoginCodeRequestDto);
    }

    @Get('info/me')
    infoMe() { }

    @Get('info/team')
    infoTeam() { }

    @Put('password')
    updatePassword() { }
}

@Controller('admin/user')
export class UserAdminController {
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