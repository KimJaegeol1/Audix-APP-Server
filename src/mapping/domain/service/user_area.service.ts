import { Injectable } from "@nestjs/common";
import { CreateUserAreaDto, CreateResultUserAreaDto } from "../dto/CreateUserAreaDto";
import { PrismaService } from "src/common/db/prisma.service";
import { UserAreaRepository } from "../../infra/user_area.repository";

@Injectable()
export class UserAreaService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly userAreaRepository: UserAreaRepository
    ) { }

    async create(createUserAreaDto: CreateUserAreaDto): Promise<CreateResultUserAreaDto> {
        const result: boolean = await this.prisma.$transaction(async (tx) => {
            await this.userAreaRepository.createUserArea(createUserAreaDto, tx);
            return true;
        });

        return new CreateResultUserAreaDto({
            userId: createUserAreaDto.userId,
            areaId: createUserAreaDto.areaId,
            isSuccess: result
        });
    }

    async findAll(): Promise<object[]> {
        return this.userAreaRepository.getAllInfo();
    }

    async deleteAll(): Promise<boolean> {
        const result: boolean = await this.prisma.$transaction(async (tx) => {
            return this.userAreaRepository.deleteAllUserArea(tx);
        });
        return result;
    }

}