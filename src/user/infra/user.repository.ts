import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/db/prisma.service";
import { Prisma, users } from "@prisma/client";
import { CreateUserDto } from "../domain/dto/CreateUserDto";

@Injectable()
export class UsersRepository {
    constructor(private readonly prisma: PrismaService) { }
    async getUserById(id: number): Promise<users | null> {
        const userInfo = await this.prisma.users.findUnique({
            where: { id: id },
        })
        return userInfo;
    }
    async createUser(createUserDto: CreateUserDto): Promise<users> {
        const userData = CreateUserDto.to(createUserDto);
        const userInfo = await this.prisma.users.create({
            data: userData
        });
        return userInfo
    }
}