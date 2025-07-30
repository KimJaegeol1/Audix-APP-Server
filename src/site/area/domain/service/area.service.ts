import { Injectable, NotFoundException } from "@nestjs/common";
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


    async findOne(id: number): Promise<object> {
        const area = await this.areaRepository.getAreaById(id);
        if (!area) {
            throw new NotFoundException(`해당하는 지역이 없습니다. ID: ${id}`);
        }
        return area;
    }

    async findList(page: number, limit: number): Promise<object[]> {
        const areaList = await this.areaRepository.getAreaList(page, limit);
        return areaList;
    }
}