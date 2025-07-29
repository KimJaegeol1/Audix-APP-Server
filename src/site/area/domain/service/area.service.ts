import { Injectable } from "@nestjs/common";
import { CreateRequestAreaDto } from "../../presentation/dto/create-area.dto";
import { CreateResultAreaDto, CreateAreaDto } from "../dto/CreateAreaDto";
import { PrismaService } from "src/common/db/prisma.service";
import { AreaRepository } from "../../infra/area.repository";

@Injectable()
export class AreaService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly areaRepository: AreaRepository
    ) { }

    async create(createRequestAreaDto: CreateRequestAreaDto):
        Promise<CreateResultAreaDto> {
        const { name, address, explain, status, image } = createRequestAreaDto;

        const result: boolean = await this.prisma.$transaction(async (tx) => {
            const createAreaDto = new CreateAreaDto();
            createAreaDto.name = name;
            createAreaDto.address = address;
            createAreaDto.explain = explain;
            createAreaDto.status = status;
            createAreaDto.image = image;

            await this.areaRepository.createArea(createAreaDto, tx);

            return true;
        })

        return new CreateResultAreaDto({
            name: name,
            isSuccess: result
        })
    }
}