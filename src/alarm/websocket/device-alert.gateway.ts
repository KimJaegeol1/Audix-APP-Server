import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect
} from '@nestjs/websockets'
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: "*",
    },
})
export class DeviceAlertGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private readonly logger = new Logger(DeviceAlertGateway.name);

    handleConnection(client: Socket) {
        this.logger.log(`WebSocket 클라이언트 연결: ${client.id}`);
    }
    handleDisconnect(client: Socket) {
        this.logger.log(`WebSocket 클라이언트 연결 해제: ${client.id}`);
    }

    // Redis PubSub에서 받은 메시지를 모든 클라이언트에게 전송
    sendAlert(message: any) {
        this.server.emit('device-alert', message);
        this.logger.log(`📡 WebSocket 알림 전송: ${JSON.stringify(message)}`);
    }
}