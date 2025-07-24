import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/db/prisma.service";

@Injectable()
export class CartRepository{
    constructor(
        private readonly prisma: {PrismaService}
    )
}