import { Controller, Post, Get, Param, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { RedisPubSubService } from '../redis/redis-pubsub.service';

@Controller('test')
export class TestController {
    constructor(private readonly redisPubSubService: RedisPubSubService) { }

    // 테스트용 알림 발행
    @Post('alert/:deviceId')
    async publishTestAlert(
        @Param('deviceId', ParseIntPipe) deviceId: number,
        @Query('normalScore', new DefaultValuePipe(0.3)) normalScore: number
    ) {
        await this.redisPubSubService.publishTestAlert(deviceId, normalScore);
        return {
            success: true,
            message: `장비 ${deviceId}에 대한 테스트 알림이 발행되었습니다. (normalScore: ${normalScore})`
        };
    }

    // 모든 알림 메시지 히스토리 조회
    @Get('alerts')
    async getAllAlerts(): Promise<{ success: boolean; totalCount: number; alerts: any[] }> {
        const alerts = await this.redisPubSubService.getAllAlerts();
        return {
            success: true,
            totalCount: alerts.length,
            alerts: alerts
        };
    }
}
