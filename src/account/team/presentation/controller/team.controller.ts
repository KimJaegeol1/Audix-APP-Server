import { Controller, Post, Get, Body, Param, Query, ParseIntPipe, DefaultValuePipe, Delete } from "@nestjs/common";
import { CreateRequestTeamDto } from "../dto/create-team.dto";
import { TeamService } from "../../domain/service/team.service";
import { NUMBER_CONSTANTS } from "src/common/constants/number";

@Controller('admin/team')
export class TeamController {
    constructor(private readonly teamService: TeamService) { }

    //---CREATE---
    @Post('')
    create(@Body() createRequestTeamDto: CreateRequestTeamDto) {
        return this.teamService.createTeam(createRequestTeamDto);
    }
    //---READ---
    @Get('all')
    findAll(@Query('page', new DefaultValuePipe(NUMBER_CONSTANTS.DEFAULT_PAGE), ParseIntPipe) page: number, @Query('limit', new DefaultValuePipe(NUMBER_CONSTANTS.DEFAULT_LIMIT), ParseIntPipe) limit: number) {
        return this.teamService.findAll(page, limit);
    }
    @Get('list/:companyId')
    findListByCompanyId(@Param('companyId', ParseIntPipe) companyId: number) {
        return this.teamService.findListByCompanyId(companyId);
    }
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.teamService.findOne({ id });
    }
    //---UPDATE---
    //---DELETE---
    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.teamService.delete(id);
    }
}