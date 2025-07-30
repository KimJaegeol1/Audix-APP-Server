import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/db/prisma.service";
import { Prisma, users } from "@prisma/client";
import { CreateUserDto } from "../domain/dto/CreateUserDto";

@Injectable()
export class UserRepository {
    constructor(private readonly prisma: PrismaService) { }

    async createUser(createUserDto: CreateUserDto, tx: Prisma.TransactionClient = this.prisma): Promise<Boolean> {
        const userData = CreateUserDto.to(createUserDto);
        await tx.users.create({
            data: userData
        });
        return true;
    }

    async getUserById(id: number): Promise<users | null> {
        const userInfo = await this.prisma.users.findUnique({
            where: { id: id },
        })
        return userInfo;
    }

    async getUserList(page: number | 0, limit: number | 100): Promise<users[]> {
        const userList = await this.prisma.users.findMany({
            skip: page * limit || 0,
            take: limit,
        });
        return userList;
    }

}