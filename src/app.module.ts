import { Module } from '@nestjs/common';
import { UserModule } from './account/user/user.module';
import { AreaModule } from './site/area/area.module';
import { RedisModule } from './common/db/redis.moudle';

@Module({
  imports: [UserModule, RedisModule, AreaModule],
})
export class AppModule { }
