import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { IMessage } from './interfaces';
import { SupportRequestsApiService } from './support-requests-api.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role, Roles } from '../auth/roles.decorator';
import { Types } from 'mongoose';
import { SupportRequestsAccessGuard } from './guards/support-requests-access.guard';
import { UserDocument } from '../users/schemas/user.schema';
import { SendMessageDto } from './dto/sendMessage.dto';

@Controller('api/common/support-requests')
export class SupportRequestsCommonApiController {
  constructor(
    private readonly supportRequestsApiService: SupportRequestsApiService,
  ) {}

  //  2.5.4. Получение истории сообщений из обращения в техподдержку
  @Get(':id/messages')
  @UseGuards(JwtAuthGuard, RolesGuard, SupportRequestsAccessGuard)
  @Roles([Role.Manager, Role.Client])
  async getAllSupportRequestMessages(
    @Param('id') id: Types.ObjectId,
  ): Promise<IMessage[]> {
    return this.supportRequestsApiService.getMessages(id);
  }

  // 2.5.5. Отправка сообщения
  @Post(':id/messages')
  @UseGuards(JwtAuthGuard, RolesGuard, SupportRequestsAccessGuard)
  @Roles([Role.Manager, Role.Client])
  async sendMessage(
    @Param('id') supportRequestId: Types.ObjectId,
    @Body() body: { text: string },
    @Req() req: Request & { user: UserDocument },
  ): Promise<IMessage[]> {
    const sendMessageDto = new SendMessageDto(
      req.user.id,
      supportRequestId,
      body.text,
    );

    return this.supportRequestsApiService.sendMessage(sendMessageDto);
  }

  //  2.5.6. Отправка события, что сообщения прочитаны
  // @Post(':id/messages/read')
  // @UseGuards(JwtAuthGuard, RolesGuard, SupportRequestsAccessGuard)
  // @Roles([Role.Manager, Role.Client])
  // async markMessagesAsRead(
  //   @Param('id') supportRequestId: Types.ObjectId,
  //   @Req() req: Request & { user: UserDocument },
  //   @Body() body: { createdBefore: Date },
  // ): Promise<{ success: boolean }> {
  //   const markMessagesAsReadDto = new MarkMessageAsReadDto(
  //     req.user.id,
  //     supportRequestId,
  //     body.createdBefore,
  //   );
  //   return this.supportRequestsApiService.markMessagesAsRead(
  //     markMessagesAsReadDto,
  //   );
  // }

  //  2.5.7. Подписка на сообщения из чата техподдержки
}
