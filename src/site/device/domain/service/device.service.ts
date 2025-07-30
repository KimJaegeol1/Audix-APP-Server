import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateRequestDeviceDto } from "../../presentation/dto/create-device.dto";
import { CreateResultDeviceDto, CreateDeviceDto } from "../dto/CreateDeviceDto";
import { PrismaService } from "src/common/db/prisma.service";
import { DeviceRepository } from "../../infra/device.repository";

@Injectable()
export class DeviceService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly deviceRepository: DeviceRepository
    ) { }

    async create(createRequestDeviceDto: CreateRequestDeviceDto):
        Promise<CreateResultDeviceDto> {
        const { areaId, name, address, explain, status, image } = createRequestDeviceDto;

        const result: boolean = await this.prisma.$transaction(async (tx) => {
            const createDeviceDto = new CreateDeviceDto();
            createDeviceDto.areaId = areaId;
            createDeviceDto.name = name;
            createDeviceDto.address = address;
            createDeviceDto.explain = explain;
            createDeviceDto.status = status;
            createDeviceDto.image = image;

            await this.deviceRepository.createDevice(createDeviceDto, tx);

            return true;
        })

        return new CreateResultDeviceDto({
            name: name,
            isSuccess: result
        })
    }

    async findOne(id: number): Promise<object> {
        const device = await this.deviceRepository.getDeviceById(id);
        if (!device) {
            throw new NotFoundException(`해당하는 장비가 없습니다. ID: ${id}`);
        }
        return device
    }

    async findList(page: number, limit: number): Promise<object[]> {
        const deviceList = await this.deviceRepository.getDeviceList(page, limit);
        return deviceList;
    }

    async findListByAreaId(areaId: number): Promise<object[]> {
        const devices = await this.deviceRepository.getDeviceListByAreaId(areaId);
        if (!devices || devices.length === 0) {
            throw new NotFoundException(`해당하는 지역의 장비가 없습니다. Area ID: ${areaId}`);
        }
        return devices;
    }
}