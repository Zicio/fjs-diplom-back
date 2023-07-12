import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { SupportRequestsService } from '../support-requests/support-requests.service';
import { SupportRequestDocument } from '../support-requests/schemas/support-request.schema';
import { MessageDocument } from '../support-requests/schemas/message.schema';
import { Socket } from 'socket.io';
import { ID } from '../globalType';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SupportRequestsAccessGuard } from './guards/support-requests-access.guard';
import { Role, Roles } from '../auth/roles.decorator';
import { JwtSocketAuthGuard } from './guards/jwt-socket-auth.guard';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SupportRequestsApiGateway {
  constructor(private readonly supportRequestService: SupportRequestsService) {}

  //  2.5.7. Подписка на сообщения из чата техподдержки
  @UseGuards(JwtSocketAuthGuard, RolesGuard, SupportRequestsAccessGuard)
  @Roles([Role.Manager, Role.Client])
  @SubscribeMessage('subscribeToChat')
  handleSubscribeToChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { chatId: string },
  ) {
    const handler = (
      supportRequest: SupportRequestDocument,
      message: MessageDocument & {
        createdAt: Date;
        readAt: Date;
        author: { id: ID; name: string };
      },
    ): void => {
      if (supportRequest.id === body.chatId) {
        const { id, createdAt, text, readAt, author } = message;
        const response = {
          id,
          createdAt,
          text,
          readAt,
          author: {
            id: author.id,
            name: author.name,
          },
        };
        client.emit('subscribeToChat', response);
      }
    };
    return this.supportRequestService.subscribe(handler);
  }
}
