import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupportRequestsClientService } from '../support-requests/support-requests-client.service';
import { CreateSupportRequestDto } from './dto/createSupportRequest.dto';
import {
  IMessage,
  IQueryGetSupportRequestsParams,
  ISupportRequest,
} from './interfaces';
import { SupportRequestDocument } from '../support-requests/schemas/support-request.schema';
import { SupportRequestsService } from '../support-requests/support-requests.service';
import { SupportRequestsEmployeeService } from '../support-requests/support-requests-employee.service';
import { UserDocument } from '../users/schemas/user.schema';
import {
  Message,
  MessageDocument,
} from '../support-requests/schemas/message.schema';
import { Types } from 'mongoose';
import { UsersService } from '../users/users.service';
import { SendMessageDto } from './dto/sendMessage.dto';

@Injectable()
export class SupportRequestsApiService {
  constructor(
    private readonly supportRequestsService: SupportRequestsService,
    private readonly supportRequestsClientService: SupportRequestsClientService,
    private readonly supportRequestsEmployeeService: SupportRequestsEmployeeService,
    private readonly userService: UsersService,
  ) {}

  //  2.5.1. Создание обращения в поддержку
  async createSupportRequest(
    createSupportRequestDto: CreateSupportRequestDto,
  ): Promise<ISupportRequest> {
    try {
      const { text, user } = createSupportRequestDto;

      const {
        id: supportRequestId,
        createdAt,
        isActive,
      } = (await this.supportRequestsClientService.createSupportRequest(
        user,
      )) as SupportRequestDocument & { createdAt: string };

      await this.supportRequestsService.sendMessage({
        author: user,
        supportRequest: supportRequestId,
        text,
      });

      const unreadMessages: Message[] =
        await this.supportRequestsClientService.getUnreadCount(
          supportRequestId,
        );

      const hasNewMessages = !!unreadMessages.length;

      return {
        id: supportRequestId,
        createdAt,
        isActive,
        hasNewMessages,
      };
    } catch (e) {
      throw new InternalServerErrorException('Ошибка при создании обращения');
    }
  }

  //  2.5.2. Получение списка обращений в поддержку для клиента
  //  2.5.3. Получение списка обращений в поддержку для менеджера
  async getSupportRequests(
    query: IQueryGetSupportRequestsParams,
    user: Types.ObjectId | null,
  ): Promise<ISupportRequest[]> {
    try {
      const supportRequests =
        (await this.supportRequestsService.findSupportRequests({
          user,
          ...query,
        })) as Array<
          SupportRequestDocument & { createdAt: string; user: UserDocument }
        >;
      const supportRequestsPromises: Promise<ISupportRequest>[] =
        supportRequests.map(async (supportRequest) => {
          const { id, createdAt, isActive, user: userData } = supportRequest;
          const unreadMessages: Message[] = user
            ? await this.supportRequestsClientService.getUnreadCount(id)
            : await this.supportRequestsEmployeeService.getUnreadCount(id);
          const hasNewMessages = !!unreadMessages.length;
          if (!user) {
            const { id: userId, name, email, contactPhone } = userData;
            const client = {
              id: userId,
              name,
              email,
              contactPhone,
            };
            return {
              id,
              createdAt,
              isActive,
              hasNewMessages,
              client,
            };
          }
          return {
            id,
            createdAt,
            isActive,
            hasNewMessages,
          };
        });
      return Promise.all(supportRequestsPromises);
    } catch (e) {
      throw new InternalServerErrorException('Ошибка при получении обращений');
    }
  }

  //  2.5.4. Получение истории сообщений из обращения в техподдержку
  async getMessages(supportRequestId: Types.ObjectId): Promise<IMessage[]> {
    try {
      const messages: Message[] = await this.supportRequestsService.getMessages(
        supportRequestId,
      );
      const messagesPromises: Promise<IMessage>[] = messages.map(
        async (message: MessageDocument) => {
          const { id: messageId, sentAt, text, readAt, author } = message;
          const { id: authorId, name } = (await this.userService.findById(
            author,
          )) as UserDocument;
          return {
            id: messageId,
            createdAt: sentAt.toString(),
            text,
            readAt: readAt?.toString() || null,
            author: {
              id: authorId,
              name,
            },
          };
        },
      );
      return Promise.all(messagesPromises);
    } catch (e) {
      throw new InternalServerErrorException('Ошибка получения сообщений');
    }
  }

  //  2.5.5. Отправка сообщения
  async sendMessage(sendMessageDto: SendMessageDto): Promise<IMessage[]> {
    try {
      await this.supportRequestsService.sendMessage(sendMessageDto);
      return this.getMessages(sendMessageDto.supportRequest);
    } catch (e) {
      throw new InternalServerErrorException('Сообщение не отправлено');
    }
  }
}
