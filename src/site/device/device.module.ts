import { Module } from "@nestjs/common";
import { DeviceController, DeviceInRedisController } from "./presentation/controller/device.controller";
import { DeviceService, DeviceInRedisService } from "./domain/service/device.service";
import { DeviceRepository } from "./infra/device.repository";
import { DeviceInRedisRepository } from "./infra/device.redis.repository";
import { PrismaModule } from "src/common/db/prisma.module";
import { RedisModule } from "@nestjs-modules/ioredis";

@Module({
    imports: [PrismaModule, RedisModule],
    controllers: [DeviceController, DeviceInRedisController],
    providers: [DeviceService, DeviceInRedisService, DeviceRepository, DeviceInRedisRepository]
})

export class DeviceModule { }