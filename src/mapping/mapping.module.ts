import { Module } from "@nestjs/common";
import { UserAreaController } from "./presentation/controller/user_area.controller";
import { UserAreaService } from "./domain/service/user_area.service";
import { UserAreaRepository } from "./infra/user_area.repository";
import { PrismaModule } from "src/common/db/prisma.module";

@Module({
    imports: [PrismaModule],
    controllers: [UserAreaController],
    providers: [UserAreaService, UserAreaRepository]
})

export class MappingModule { }