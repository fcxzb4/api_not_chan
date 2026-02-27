import { 
  WebSocketGateway, 
  OnGatewayConnection, 
  OnGatewayDisconnect, 
  WebSocketServer,
  SubscribeMessage
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';
import * as cookie from 'cookie';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('EventsGateway');

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    this.logger.log(`Client connected attempting authentication: ${client.id}`);
    
    try {
      const cookies = client.handshake.headers.cookie;
      if (!cookies) {
        throw new Error('No cookies found');
      }

      const parsedCookies = cookie.parse(cookies);
      const token = parsedCookies.access_token;
      
      if (!token) {
        throw new Error('No access_token cookie found');
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'SEU_SEGREDO_SUPER_SECRETO_E_LONGO_123456'
      });
      
      // Attach user payload to the socket object for later use
      client.data.user = payload;
      this.logger.log(`Client authenticated successfully: ${client.id} (User: ${payload.email})`);
    } catch (error) {
      this.logger.error(`Authentication failed for client ${client.id}: ${error.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): string {
    const user = client.data.user;
    this.logger.log(`Message received from ${user?.email || 'Unknown'}: ${JSON.stringify(payload)}`);
    return `Hello ${user?.name || 'World'}, you sent: ${JSON.stringify(payload)}`;
  }
}