import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateRequestDeviceDto } from "../../presentation/dto/create-device.dto";
import { CreateResultDeviceDto, CreateDeviceDto } from "../dto/CreateDeviceDto";
import { PrismaService } from "src/common/db/prisma.service";
import { DeviceRepository } from "../../infra/device.repository";
import { DeviceInRedisRepository } from "../../infra/device.redis.repository";
import { CreateDeviceInRedisDto } from "../dto/CreateDeviceInRedisDto";
import { NUMBER_CONSTANTS } from "src/common/constants/number";

@Injectable()
export class DeviceService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly deviceRepository: DeviceRepository,
        private readonly deviceInRedisRepository: DeviceInRedisRepository
    ) { }

    //---CREATE---
    async create(createRequestDeviceDto: CreateRequestDeviceDto):
        Promise<CreateResultDeviceDto> {
        const { areaId, name, model, deviceManager, address, explain, status, image, parts } = createRequestDeviceDto;

        const result: boolean = await this.prisma.$transaction(async (tx) => {
            const createDeviceDto = new CreateDeviceDto();
            const createDeviceInRedisDto = new CreateDeviceInRedisDto();

            // parts를 string에서 string[] 배열로 변환
            const partsArray = parts ? parts.split(',').map(part => part.trim()) : [];

            createDeviceDto.areaId = areaId;
            createDeviceDto.name = name;
            createDeviceDto.model = model;
            createDeviceDto.deviceManager = deviceManager;
            createDeviceDto.address = address;
            createDeviceDto.explain = explain;
            createDeviceDto.status = status;
            createDeviceDto.image = image;
            createDeviceDto.parts = partsArray;

            // DB에 저장하고 생성된 device 객체 반환받기
            const createDevice = await this.deviceRepository.createDevice(createDeviceDto, tx);

            if (!createDevice) {
                throw new NotFoundException(`장비 생성에 실패했습니다.`);
            }

            // Redis에 저장할 데이터 설정
            createDeviceInRedisDto.deviceId = createDevice.id;
            createDeviceInRedisDto.areaId = createDevice.area_id ?? undefined;
            createDeviceInRedisDto.name = createDevice.name;
            createDeviceInRedisDto.model = createDevice.model;
            createDeviceInRedisDto.address = createDevice.address;
            createDeviceInRedisDto.deviceManager = createDevice.device_manager;

            // parts 객체 초기화 후 데이터 설정
            createDeviceInRedisDto.parts = {};
            for (const part of createDevice.parts) {
                createDeviceInRedisDto.parts[part] = NUMBER_CONSTANTS.DEFAULT_DEVICE_NORMAL_SCORE;
            }

            createDeviceInRedisDto.normalScore = NUMBER_CONSTANTS.DEFAULT_DEVICE_NORMAL_SCORE;
            createDeviceInRedisDto.image = createDevice.image ?? '';
            createDeviceInRedisDto.status = createDevice.status ?? '';
            createDeviceInRedisDto.aiText = '';

            // Redis에 저장
            await this.deviceInRedisRepository.createDevice(createDeviceInRedisDto);

            return true;
        })

        return new CreateResultDeviceDto({
            name: name,
            isSuccess: result
        })
    }
    //---READ---
    async findOne(id: number): Promise<object> {
        const device = await this.deviceRepository.getDeviceByDeviceId(id);

        if (!device) {
            throw new NotFoundException(`해당하는 장비가 없습니다. ID: ${id}`);
        }

        return device
    }
    async findAll(page: number, limit: number): Promise<object[]> {
        const deviceList = await this.deviceRepository.getDeviceListAll(page, limit);

        return deviceList;
    }
    async findListByAreaId(areaId: number): Promise<object[]> {
        const deviceList = await this.deviceRepository.getDeviceListByAreaId(areaId);

        return deviceList;
    }
    //---UPDATE---
    async update(id: number, updateData: Partial<CreateDeviceDto>): Promise<any> {
        const device = await this.deviceRepository.getDeviceByDeviceId(id);

        if (!device) {
            throw new NotFoundException(`해당하는 장비가 없습니다. ID: ${id}`);
        }

        const result = await this.deviceRepository.updateDeviceByDeviceId(id, updateData);

        await this.deviceInRedisRepository.updateDevice(id, updateData);

        return result;
    }
    //---DELETE---
    async delete(id: number): Promise<any> {
        const device = await this.deviceRepository.getDeviceByDeviceId(id);

        if (!device) {
            throw new NotFoundException(`해당하는 장비가 없습니다. ID: ${id}`);
        }

        const result = await this.deviceRepository.deleteDeviceByDeviceId(id);
        await this.deviceInRedisRepository.deleteDeviceByDeviceId(id);

        return result;
    }
    async deleteALL(): Promise<any> {
        const result = await this.deviceRepository.deleteDeviceALL();

        if (!result) {
            throw new NotFoundException(`장비 전체 삭제에 실패했습니다.`);
        }

        await this.deviceInRedisRepository.deleteDeviceALL();

        return result;
    }
    async deleteListByAreaId(areaId: number): Promise<any> {
        const result = await this.deviceRepository.deleteDeviceListByAreaId(areaId);

        if (!result) {
            throw new NotFoundException(`해당하는 지역의 장비 삭제에 실패했습니다. Area ID: ${areaId}`);
        }

        await this.deviceInRedisRepository.deleteDeviceByAreaId(areaId);

        return true;
    }
}

@Injectable()
export class DeviceInRedisService {
    constructor(
        private readonly deviceInRedisRepository: DeviceInRedisRepository
    ) { }

    //---READ---
    async findOne(id: number): Promise<CreateDeviceInRedisDto | null> {
        const device = await this.deviceInRedisRepository.getDeviceByDeviceId(id);

        if (!device) {
            throw new NotFoundException(`해당하는 기기가 없습니다. Device ID: ${id}`);
        }

        return device;
    }
    async findAll(): Promise<CreateDeviceInRedisDto[]> {
        return await this.deviceInRedisRepository.getDeviceListAll();
    }
    async findListByAreaId(areaId: number): Promise<CreateDeviceInRedisDto[]> {
        const deviceList = await this.deviceInRedisRepository.getDeviceListByAreaId(areaId);

        return deviceList;
    }
    //---UPDATE--- // 아직 미구현
    async update(id: number, updateData: Partial<CreateDeviceInRedisDto>): Promise<void> {
        const device = await this.deviceInRedisRepository.getDeviceByDeviceId(id);
        if (!device) {
            throw new NotFoundException(`해당하는 기기가 없습니다. Device ID: ${id}`);
        }
        await this.deviceInRedisRepository.updateDevice(id, updateData);
    }
    //---DELETE---
    async delete(id: number): Promise<any> {
        const result = await this.deviceInRedisRepository.getDeviceByDeviceId(id);

        if (!result) {
            throw new NotFoundException(`해당하는 기기가 없습니다. Device ID: ${id}`);
        }

        await this.deviceInRedisRepository.deleteDeviceByDeviceId(id);

        return result;
    }
    async deleteALL(): Promise<any> {
        return await this.deviceInRedisRepository.deleteDeviceALL();
    }
    async deleteListByAreaId(areaId: number): Promise<any> {
        return await this.deviceInRedisRepository.getDeviceListByAreaId(areaId);
    }
}