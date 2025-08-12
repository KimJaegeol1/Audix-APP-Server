import { Controller, Post, Get, Body, Param, Query, ParseIntPipe, DefaultValuePipe, Put, Delete, UseGuards, Request, HttpStatus, HttpCode } from "@nestjs/common";
import { CreateRequestUserDto } from "../dto/create-user.dto";
import { UserService } from "../../domain/service/user.service";
import { NUMBER_CONSTANTS } from "src/common/constants/number";
import { SearchhLoginCodeRequestDto } from "../dto/search-user.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";


@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get('search/login-code')
    async searchLoginCode(@Body() searchhLoginCodeRequestDto: SearchhLoginCodeRequestDto) {
        const result = await this.userService.findLoginCode(searchhLoginCodeRequestDto);
        return {
            statusCode: HttpStatus.OK,
            message: '로그인 코드 찾기 성공',
            data: result
        };
    }

    @UseGuards(JwtAuthGuard)
    @Get('info/me')
    @HttpCode(HttpStatus.OK)
    async infoMe(@Request() req) {
        const result = await this.userService.findOne(req.user.id);
        return {
            statusCode: HttpStatus.OK,
            message: '내 정보 조회 성공',
            data: result
        };
    }

    @Get('info/team')
    async infoTeam() { }

    @Put('password')
    async updatePassword() { }
}

@Controller('admin/user')
export class UserAdminController {
    constructor(private readonly userService: UserService) { }

    //---CREATE---
    @Post('')
    async create(@Body() createRequestUserDto: CreateRequestUserDto) {
        return this.userService.create(createRequestUserDto)
    }
    //---READ---
    @Get('all')
    findList(@Query('page', new DefaultValuePipe(NUMBER_CONSTANTS.DEFAULT_PAGE), ParseIntPipe) page: number, @Query('limit', new DefaultValuePipe(NUMBER_CONSTANTS.DEFAULT_LIMIT), ParseIntPipe) limit: number) {
        return this.userService.findAll(page, limit);
    }
    @Get("list/:teamId")
    async findListByTeam(@Param('teamId', ParseIntPipe) teamId: number) {
        return this.userService.findListByTeamId(teamId);
    }
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.userService.findOne(id);
    }
    //---UPDATE---
    //---DELETE---
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return this.userService.delete(id);
    }

}