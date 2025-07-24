import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/db/prisma.service";
import { Prisma, users } from "@prisma/client";

@Injectable()
export class usersRepository{
    constructor(private readonly prisma: PrismaService) {}
    async getUserById(id: number): Promise<users> {
        const userInfo: users = await this.prisma.users.findUnique({
            where: { id: id },
        })
        return userInfo;
    }
}