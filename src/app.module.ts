import { Module } from '@nestjs/common';
import { UserModule } from './account/user/user.module';
import { RedisModule } from './common/db/redis.moudle';

@Module({
  imports: [UserModule, RedisModule],
})
export class AppModule { }
