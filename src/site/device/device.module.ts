import { Module } from "@nestjs/common";
import { DeviceController, DeviceInRedisController } from "./presentation/controller/device.controller";
import { DeviceService, DeviceInRedisService } from "./domain/service/device.service";
import { DeviceRepository } from "./infra/device.repository";
import { DeviceRedisRepository } from "./infra/device.redis.repository";
import { PrismaModule } from "src/common/db/prisma.module";

@Module({
    imports: [PrismaModule],
    controllers: [DeviceController, DeviceInRedisController],
    providers: [DeviceService, DeviceInRedisService, DeviceRepository, DeviceRedisRepository]
})

export class DeviceModule { }