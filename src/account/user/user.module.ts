import { Module } from "@nestjs/common";
import { UserController } from "./presentation/controller/user.controller";
import { UserService } from "./domain/service/user.service";
import { UserRepository } from "./infra/user.repository";

@Module({
    controllers: [UserController],
    providers: [UserService, UserRepository]
})

export class UserModule { }