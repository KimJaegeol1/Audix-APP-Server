import { Module } from '@nestjs/common';
import { RedisModule } from './common/db/redis.moudle';
import { RedisPubSubModule } from './alarm/redis-pubsub/redis-pubsub.module';
import { TestController } from './alarm/test/test.controller';

import { UserModule } from './account/user/user.module';
import { AreaModule } from './site/area/area.module';
import { DeviceModule } from './site/device/device.module';
import { MappingModule } from './mapping/mapping.module';

@Module({
  imports: [RedisModule, RedisPubSubModule, UserModule, AreaModule, DeviceModule, MappingModule],
  controllers: [TestController],
})
export class AppModule { }
