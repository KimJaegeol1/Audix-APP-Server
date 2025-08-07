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

    //---CREATE---
    async create(createRequestAreaDto: CreateRequestAreaDto):
        Promise<CreateResultAreaDto> {
        const { name, address, explain, status, image } = createRequestAreaDto;

        const result: boolean = await this.prisma.$transaction(async (tx) => {
            const createAreaDto = new CreateAreaDto();
            // 중복체크 넣어야 한다.
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
    //---READ---
    async findOne(id: number): Promise<object> {
        const area = await this.areaRepository.getAreaById(id);
        if (!area) {
            throw new NotFoundException(`해당하는 지역이 없습니다. ID: ${id}`);
        }
        return area;
    }

    async findAll(page: number, limit: number): Promise<object[]> {
        const areaList = await this.areaRepository.getAreaListAll(page, limit);
        return areaList;
    }
    async findListByUserId(userId: number): Promise<object[]> {
        const areas = await this.areaRepository.getAreaListByUserId(userId);
        if (!areas || areas.length === 0) {
            throw new NotFoundException(`해당하는 사용자의 지역이 없습니다. User ID: ${userId}`);
        }
        return areas;
    }
    //---UPDATE---
    async update(id: number, updateData: Partial<CreateAreaDto>): Promise<boolean> {
        const area = await this.areaRepository.getAreaById(id);
        if (!area) {
            throw new NotFoundException(`해당하는 지역이 없습니다. ID: ${id}`);
        }
        await this.areaRepository.updateAreaByAreaId(id, updateData);
        return true;
    }
    //---DELETE---
    async delete(id: number): Promise<boolean> {
        const area = await this.areaRepository.getAreaById(id);
        if (!area) {
            throw new NotFoundException(`해당하는 지역이 없습니다. ID: ${id}`);
        }
        await this.areaRepository.deleteAreaByAreaId(id);
        return true;
    }
    async deleteListByUserId(userId: number): Promise<boolean> {
        const areas = await this.areaRepository.getAreaListByUserId(userId);
        if (!areas || areas.length === 0) {
            throw new NotFoundException(`해당하는 사용자의 지역이 없습니다. User ID: ${userId}`);
        }
        return true;
    }
    async deleteALL(): Promise<any> {
        const result = await this.areaRepository.deleteAreaAll();
        return result;
    }
}