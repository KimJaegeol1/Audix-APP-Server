import { Module } from '@nestjs/common';
import { UserModule } from './account/user/user.module';
import { AreaModule } from './site/area/area.module';
import { DeviceModule } from './site/device/device.module';
import { RedisModule } from './common/db/redis.moudle';

@Module({
  imports: [RedisModule, UserModule, AreaModule, DeviceModule],
})
export class AppModule { }
