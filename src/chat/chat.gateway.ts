import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';

import { Server, Socket } from 'socket.io';
import { ChatClient, MessageChat } from './interfaces/usersChat.interfaces';

@WebSocketGateway(80, {
  namespace: 'chat',
  cors: '*',
  transports: ['websocket'],
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  public server: Server;
  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log('Client connected: ' + client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected: ' + client.id);
  }

  @SubscribeMessage('posts')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: CreateChatDto,
  ) {
    const token: string = client.handshake.auth?.token;
    if (!token) {
      client.disconnect();
      return;
    }
    const message: MessageChat = await this.chatService.create(payload, token);
    client.broadcast.emit(`${payload.room_id}`, message);
  }
}
