import { Module } from "@nestjs/common";
import { DeviceController } from "./presentation/controller/device.controller";
import { DeviceService } from "./domain/service/device.service";
import { DeviceRepository } from "./infra/device.repository";
import { PrismaModule } from "src/common/db/prisma.module";

@Module({
    imports: [PrismaModule],
    controllers: [DeviceController],
    providers: [DeviceService, DeviceRepository]
})

export class DeviceModule { }