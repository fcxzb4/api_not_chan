import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173', // Ajuste para o endereço do seu front-end por segurança
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('mensagem_chat')
  handleMessage(@MessageBody() data: string): void {
    console.log('Recebido:', data);
    // Envia para todos os conectados
    this.server.emit('resposta_client', { msg: 'Recebi seu sinal!', conteudo: data });
  }
}