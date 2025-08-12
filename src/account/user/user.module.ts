import { Module } from "@nestjs/common";
import { UserAdminController } from "./presentation/controller/user.controller";
import { UserService } from "./domain/service/user.service";
import { UserRepository } from "./infra/user.repository";
import { PrismaModule } from "src/common/db/prisma.module";

@Module({
    imports: [PrismaModule],
    controllers: [UserAdminController],
    providers: [UserService, UserRepository]
})

export class UserModule { }