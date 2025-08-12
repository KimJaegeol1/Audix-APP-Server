import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/db/prisma.service";
import { Prisma, users } from "@prisma/client";
import { CreateUserDto } from "../domain/dto/CreateUserDto";
import { SearchLoginCodeDto } from "../domain/dto/SearchUserDto";

@Injectable()
export class UserRepository {
    constructor(private readonly prisma: PrismaService) { }

    //---CREATE---
    async createUser(createUserDto: CreateUserDto, tx: Prisma.TransactionClient = this.prisma): Promise<Boolean> {
        await tx.users.create({
            data: CreateUserDto.to(createUserDto)
        });
        return true;
    }
    //---READ---
    async getUserById(id: number): Promise<users | null> {
        const userInfo = await this.prisma.users.findUnique({
            where: { id: id },
        })
        return userInfo;
    }
    async getAllUser(page: number, limit: number): Promise<users[]> {
        const userList = await this.prisma.users.findMany({
            skip: page * limit,
            take: limit,
        });
        return userList;
    }
    async getUserByTeamId(teamId: number): Promise<users[]> {
        const userList = await this.prisma.users.findMany({
            where: { team_id: teamId },
        });
        return userList;
    }
    async getLoginCode(searchLoginCodeDto: SearchLoginCodeDto) {
        const user = await this.prisma.users.findFirst({
            where: searchLoginCodeDto
        });
        return user ? user.login_code : null;
    }
    //---UPDATE---
    async updateUserById(id: number, updateData: Partial<CreateUserDto>, tx: Prisma.TransactionClient = this.prisma): Promise<users> {
        const updatedUser = await tx.users.update({
            where: { id: id },
            data: updateData
        });
        return updatedUser;
    }
    //---DELETE---
    async deleteUserById(id: number, tx: Prisma.TransactionClient = this.prisma): Promise<Boolean> {
        await tx.users.delete({
            where: { id: id }
        });
        return true;
    }
}