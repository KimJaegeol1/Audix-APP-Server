import { Module } from '@nestjs/common';
import { RedisModule } from './common/db/redis.moudle';
import { RedisServicesModule } from './common/redis/redis-services.module';
import { TestController } from './common/test/test.controller';

import { UserModule } from './account/user/user.module';
import { AreaModule } from './site/area/area.module';
import { DeviceModule } from './site/device/device.module';
import { MappingModule } from './mapping/mapping.module';

@Module({
  imports: [RedisModule, RedisServicesModule, UserModule, AreaModule, DeviceModule, MappingModule],
  controllers: [TestController],
})
export class AppModule { }
