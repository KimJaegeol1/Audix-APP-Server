import { Module, Global } from '@nestjs/common';
import { RedisPubSubService } from './redis-pubsub.service';
import { DeviceAlertGateway } from '../websocket/device-alert.gateway';

@Global()
@Module({
    providers: [RedisPubSubService, DeviceAlertGateway],
    exports: [RedisPubSubService],
})
export class RedisPubSubModule { }
