// import {
//   Body,
//   Controller,
//   Get,
//   Param,
//   Post,
//   Req,
//   UseGuards,
// } from '@nestjs/common';
// import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
// import { RolesGuard } from '../../auth/guards/roles.guard';
// import { Role, Roles } from '../../auth/roles.decorator';
// import { Types } from 'mongoose';
// import { CreateMessageDto } from '../dto/createMessage.dto';
// import { MarkMessageAsReadDto } from '../dto/markMessageAsRead.dto';
// import { IMessage } from './interfaces';
//
// @Controller('api/common')
// export class SupportRequestsCommonApiController {
//   constructor(
//     private readonly supportRequestsCommonApiService: SupportRequestsCommonApiService,
//   ) {}
//
//   //  2.5.4. Получение истории сообщений из обращения в техподдержку
//   @Get('common/support-requests/:id/messages')
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles([Role.Manager, Role.Client])
//   async getAllSupportRequestMessages(
//     @Param('id') id: Types.ObjectId,
//     @Req() req: Request & { user: any },
//   ): Promise<IMessage[]> {
//     // const userRole = (req as Request & { userRole: string }).userRole;
//     const userRole = req.user.role;
//     return this.supportRequestsCommonApiService.getAllSupportRequestMessages(
//       id,
//       userRole,
//     ); // TODO: если Client, то возвращать ему только сообщения из его обращения
//   }
//
//   //  2.5.5. Отправка сообщения
//   @Post('common/support-requests/:id/messages')
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles([Role.Manager, Role.Client])
//   async sendMessage(
//     @Param('id') id: Types.ObjectId,
//     @Body() createMessageDto: CreateMessageDto,
//     @Req() req: Request & { user: any },
//   ): Promise<IMessage> {
//     const userRole = req.user.role;
//     return this.supportRequestsCommonApiService.sendMessage(
//       id,
//       createMessageDto,
//       userRole,
//     ); // TODO: если Client, то возвращать ему только сообщения из его обращения
//   }
//
//   //  2.5.6. Отправка события, что сообщения прочитаны
//   @Post('common/support-requests/:id/messages/read')
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles([Role.Manager, Role.Client])
//   async markMessagesAsRead(
//     @Param('id') id: Types.ObjectId,
//     @Req() req: Request & { user: any },
//     @Body() markMessagesAsReadDto: MarkMessageAsReadDto,
//   ): Promise<{ success: boolean }> {
//     const userRole = req.user.role;
//     return this.supportRequestsCommonApiService.markMessagesAsRead(
//       id,
//       markMessagesAsReadDto,
//       userRole,
//     );
//   }
//
//   //  2.5.7. Подписка на сообщения из чата техподдержки
// }
