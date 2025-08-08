import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateRequestTeamDto } from "../../presentation/dto/create-team.dto";
import { CreateResultTeamDto, CreateTeamDto } from "../dto/CreateTeamDto";
import { PrismaService } from "src/common/db/prisma.service";
import { TeamRepository } from "../../infra/team.repository";

@Injectable()
export class TeamService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly teamRepository: TeamRepository
    ) { }

    //---CREATE---
    async createTeam(createRequestTeamDto: CreateRequestTeamDto): Promise<CreateResultTeamDto> {
        const { CompanyId, explain, name } = createRequestTeamDto;

        const result: boolean = await this.prisma.$transaction(async (tx) => {
            const createTeamDto = new CreateTeamDto();
            createTeamDto.companyId = CompanyId;
            createTeamDto.explain = explain;
            createTeamDto.name = name;

            await this.teamRepository.createTeam(createTeamDto, tx);

            return true;
        });

        return new CreateResultTeamDto({
            name, isSuccess: result
        });
    }
    //---READ---
    async findOne(params: { id: number }): Promise<object> {
        const team = await this.teamRepository.getTeamById(params.id);
        if (!team) {
            throw new NotFoundException(`해당하는 팀이 없습니다. ID: ${params.id}`);
        }
        return team;
    }
    async findAll(page: number, limit: number): Promise<object[]> {
        const teams = await this.teamRepository.getAllTeam(page, limit);
        return teams;
    }
    async findListByCompanyId(companyId: number): Promise<object[]> {
        const teams = await this.teamRepository.getTeamByCompanyId(companyId);
        return teams;
    }
    //---UPDATE---
    async updateTeam(id: number, updateData: Partial<CreateTeamDto>): Promise<boolean> {
        const team = await this.teamRepository.getTeamById(id);
        if (!team) {
            throw new NotFoundException(`해당하는 팀이 없습니다. ID: ${id}`);
        }

        const result: boolean = await this.prisma.$transaction(async (tx) => {
            await this.teamRepository.update(id, updateData, tx);
            return true;
        });

        return result;
    }
    //---DELETE---
    async delete(id: number): Promise<boolean> {
        const team = await this.teamRepository.getTeamById(id);
        if (!team) {
            throw new NotFoundException(`해당하는 팀이 없습니다. ID: ${id}`);
        }

        const result: boolean = await this.prisma.$transaction(async (tx) => {
            await this.teamRepository.delete(id, tx);
            return true;
        });

        return result;
    }
}