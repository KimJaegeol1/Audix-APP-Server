import { Module } from '@nestjs/common';
import { RedisModule } from './common/db/redis.moudle';

import { UserModule } from './account/user/user.module';
import { AreaModule } from './site/area/area.module';
import { DeviceModule } from './site/device/device.module';
import { MappingModule } from './mapping/mapping.module';

@Module({
  imports: [RedisModule, UserModule, AreaModule, DeviceModule, MappingModule],
})
export class AppModule { }
