import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/db/prisma.service";
import { Prisma, devices } from "@prisma/client";
import { CreateDeviceDto } from "../domain/dto/CreateDeviceDto";

@Injectable()
export class DeviceRepository {
    constructor(private readonly prisma: PrismaService) { }

    async createDevice(createDeviceDto: CreateDeviceDto, tx: Prisma.TransactionClient = this.prisma): Promise<Boolean> {
        const deviceData = CreateDeviceDto.to(createDeviceDto);
        await tx.devices.create({
            data: deviceData
        })
        return true;
    }

    async getDeviceById(id: number): Promise<devices | null> {
        const deviceInfo = await this.prisma.devices.findUnique({
            where: { id: id },
        })
        return deviceInfo;
    }

    async getDeviceList(page: number, limit: number): Promise<devices[]> {
        const deviceList = await this.prisma.devices.findMany({
            skip: page * limit,
            take: limit,
        });
        return deviceList;
    }

    async getDeviceListByAreaId(areaId: number): Promise<devices[]> {
        const deviceList = await this.prisma.devices.findMany({
            where: { area_id: areaId },
        });
        return deviceList;
    }
}