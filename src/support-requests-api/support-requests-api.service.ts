import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupportRequestsClientService } from '../support-requests/support-requests-client.service';
import { CreateSupportRequestDto } from './dto/createSupportRequest.dto';
import { IQueryGetSupportRequestsParams, ISupportRequest } from './interfaces';
import { SupportRequestDocument } from '../support-requests/schemas/support-request.schema';
import { SupportRequestsService } from '../support-requests/support-requests.service';
import { SupportRequestsEmployeeService } from '../support-requests/support-requests-employee.service';
import { UserDocument } from '../users/schemas/user.schema';
import { Role } from '../auth/roles.decorator';
import { Message } from '../support-requests/schemas/message.schema';

@Injectable()
export class SupportRequestsApiService {
  constructor(
    private readonly supportRequestsService: SupportRequestsService,
    private readonly supportRequestsClientService: SupportRequestsClientService,
    private readonly supportRequestsEmployeeService: SupportRequestsEmployeeService,
  ) {}

  //  2.5.1. Создание обращения в поддержку
  async createSupportRequest(
    createSupportRequestDto: CreateSupportRequestDto,
  ): Promise<ISupportRequest> {
    try {
      const { id, createdAt, isActive } =
        (await this.supportRequestsClientService.createSupportRequest(
          createSupportRequestDto,
        )) as SupportRequestDocument & { createdAt: string };
      const unreadMessages: Message[] =
        await this.supportRequestsClientService.getUnreadCount(id);
      const hasNewMessages = !!unreadMessages.length;
      return {
        id,
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
    user: UserDocument,
  ): Promise<ISupportRequest[]> {
    try {
      const { id: userId, role } = user;
      const supportRequests =
        (await this.supportRequestsService.findSupportRequests({
          user: userId,
          ...query,
        })) as Array<
          SupportRequestDocument & { createdAt: string; user: UserDocument }
        >;
      const supportRequestsPromises: Promise<ISupportRequest>[] =
        supportRequests.map(async (supportRequest) => {
          const { id, createdAt, isActive, user } = supportRequest;
          const unreadMessages: Message[] =
            role === Role.Client
              ? await this.supportRequestsClientService.getUnreadCount(id)
              : await this.supportRequestsEmployeeService.getUnreadCount(id);
          const hasNewMessages = !!unreadMessages.length;
          if (role !== Role.Client) {
            const { name, email, contactPhone } = user;
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
}
