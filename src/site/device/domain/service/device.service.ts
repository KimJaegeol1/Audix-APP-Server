import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateRequestDeviceDto } from "../../presentation/dto/create-device.dto";
import { CreateResultDeviceDto, CreateDeviceDto } from "../dto/CreateDeviceDto";
import { PrismaService } from "src/common/db/prisma.service";
import { DeviceRepository } from "../../infra/device.repository";
import { DeviceRedisRepository, DeviceDataInRedis } from "../../infra/device.redis.repository";

@Injectable()
export class DeviceService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly deviceRepository: DeviceRepository,
        private readonly deviceRedisRepository: DeviceRedisRepository
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

    async createDeviceInRedis(deviceDataInRedis: DeviceDataInRedis): Promise<void> {
        await this.deviceRedisRepository.createDevice(deviceDataInRedis);
    }

    async findDeviceFromRedisByDeviceId(deviceId: number): Promise<DeviceDataInRedis | null> {
        const device = await this.deviceRedisRepository.getDeviceByDeviceId(deviceId);
        if (!device) {
            throw new NotFoundException(`해당하는 기기가 없습니다. Device ID: ${deviceId}`);
        }
        return device;
    }

    async findAllDevicesFromRedis(): Promise<DeviceDataInRedis[]> {
        return await this.deviceRedisRepository.getAllDevices();
    }

    async findDeviceListFromRedisByAreaId(areaId: number): Promise<DeviceDataInRedis[]> {
        const deviceList = await this.deviceRedisRepository.getDevicesByAreaId(areaId);
        if (!deviceList || deviceList.length === 0) {
            throw new NotFoundException(`해당하는 지역의 기기가 없습니다. Area ID: ${areaId}`);
        }
        return deviceList;
    }

}