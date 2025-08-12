import { Module } from "@nestjs/common";
import { DeviceController, DeviceInRedisController, DeviceAdminController } from "./presentation/controller/device.controller";
import { DeviceService, DeviceInRedisService } from "./domain/service/device.service";
import { DeviceRepository } from "./infra/device.repository";
import { DeviceInRedisRepository } from "./infra/device.redis.repository";
import { PrismaModule } from "src/common/db/prisma.module";
import { RedisModule } from "src/common/db/redis.module";

@Module({
    imports: [PrismaModule, RedisModule],
    controllers: [DeviceController, DeviceInRedisController, DeviceAdminController],
    providers: [DeviceService, DeviceInRedisService, DeviceRepository, DeviceInRedisRepository]
})

export class DeviceModule { }