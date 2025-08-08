import { Module } from '@nestjs/common';
import { RedisModule } from './common/db/redis.module';
import { RedisPubSubModule } from './alarm/redis-pubsub/redis-pubsub.module';
import { TestController } from './alarm/test/test.controller';

import { UserModule } from './account/user/user.module';
import { AreaModule } from './site/area/area.module';
import { DeviceModule } from './site/device/device.module';
import { MappingModule } from './mapping/mapping.module';
import { CompanyModule } from './account/company/company.module';

import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from './common/multer/multer.config';

@Module({
  imports: [RedisModule, RedisPubSubModule, UserModule, AreaModule, DeviceModule, MappingModule, MulterModule.register(multerConfig), CompanyModule],
  controllers: [TestController],
})
export class AppModule { }
