import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { RedisModule as NestRedisModule } from "@nestjs-modules/ioredis";

@Module({
    imports: [
        ConfigModule.forRoot(),
        NestRedisModule.forRoot({
            type: 'single',
            url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`
        })
    ]
})

export class RedisModule { }