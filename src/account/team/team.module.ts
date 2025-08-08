import { Module } from "@nestjs/common";
import { TeamController } from "./presentation/controller/team.controller";
import { TeamService } from "./domain/service/team.service";
import { TeamRepository } from "./infra/team.repository";
import { PrismaModule } from "src/common/db/prisma.module";

@Module({
    imports: [PrismaModule],
    controllers: [TeamController],
    providers: [TeamService, TeamRepository]
})

export class TeamModule { }