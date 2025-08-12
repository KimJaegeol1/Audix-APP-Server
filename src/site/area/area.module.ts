import { Module } from "@nestjs/common";
import { AreaAdminController, AreaController } from "./presentation/controller/area.controller";
import { AreaService } from "./domain/service/area.service";
import { AreaRepository } from "./infra/area.repository";
import { PrismaModule } from "src/common/db/prisma.module";

@Module({
    imports: [PrismaModule],
    controllers: [AreaAdminController, AreaController],
    providers: [AreaService, AreaRepository]
})

export class AreaModule { }