import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/db/prisma.service";
import { Prisma, devices } from "@prisma/client";
import { CreateDeviceDto } from "../domain/dto/CreateDeviceDto";

@Injectable()
export class DeviceRepository {
    constructor(private readonly prisma: PrismaService) { }

    //---CREATE---
    async createDevice(createDeviceDto: CreateDeviceDto, tx: Prisma.TransactionClient = this.prisma): Promise<devices> {
        const deviceData = CreateDeviceDto.to(createDeviceDto);
        const createdDevice = await tx.devices.create({
            data: deviceData
        })
        return createdDevice; // 생성된 device 객체 반환
    }
    //---READ---
    async getDeviceByDeviceId(id: number): Promise<devices | null> {
        const deviceInfo = await this.prisma.devices.findUnique({
            where: { id: id },
        })
        return deviceInfo;
    }
    async getDeviceListAll(page: number, limit: number): Promise<devices[]> {
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
    //---UPDATE---
    async updateDeviceByDeviceId(id: number, updateData: Partial<CreateDeviceDto>): Promise<Boolean> {
        await this.prisma.devices.update({
            where: { id: id },
            data: updateData
        });
        return true;
    }
    //---DELETE---
    async deleteDeviceByDeviceId(id: number): Promise<Boolean> {
        await this.prisma.devices.delete({
            where: { id: id }
        });
        return true;
    }
    async deleteDeviceListByAreaId(areaId: number): Promise<Boolean> {
        await this.prisma.devices.deleteMany({
            where: { area_id: areaId }
        });
        return true;
    }
    async deleteDeviceALL(): Promise<Boolean> {
        await this.prisma.devices.deleteMany();
        return true;
    }
}