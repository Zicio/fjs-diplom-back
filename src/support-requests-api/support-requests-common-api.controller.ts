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
import { CreateMessageDto } from './dto/createMessage.dto';
import { UserDocument } from '../users/schemas/user.schema';

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
  @Post('support-requests/:id/messages')
  @UseGuards(JwtAuthGuard, RolesGuard, SupportRequestsAccessGuard)
  @Roles([Role.Manager, Role.Client])
  async sendMessage(
    @Param('id') id: Types.ObjectId,
    @Body() createMessageDto: CreateMessageDto,
    @Req() req: Request & { user: UserDocument },
  ): Promise<IMessage> {
    createMessageDto.author = req.user.id;
    return this.supportRequestsApiService.sendMessage(id, createMessageDto);
  }

  //
  // //  2.5.6. Отправка события, что сообщения прочитаны
  // @Post('support-requests/:id/messages/read')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles([Role.Manager, Role.Client])
  // async markMessagesAsRead(
  //   @Param('id') id: Types.ObjectId,
  //   @Req() req: Request & { user: any },
  //   @Body() markMessagesAsReadDto: MarkMessageAsReadDto,
  // ): Promise<{ success: boolean }> {
  //   const userRole = req.user.role;
  //   return this.supportRequestsApiService.markMessagesAsRead(
  //     id,
  //     markMessagesAsReadDto,
  //     userRole,
  //   );
  // }

  //  2.5.7. Подписка на сообщения из чата техподдержки
}
