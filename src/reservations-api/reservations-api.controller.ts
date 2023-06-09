// import {
//   Body,
//   Controller,
//   Delete,
//   Get,
//   Param,
//   Post,
//   UseGuards,
// } from '@nestjs/common';
// import { ReservationsApiService } from './reservations-api.service';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { RolesGuard } from '../auth/roles.guard';
// import { Role, Roles } from '../auth/roles.decorator';
// import { CreateReservationDto } from './dto/create-reservation.dto';
// import { Types } from 'mongoose';
//
// export interface IReservation {
//   startDate: string;
//   endDate: string;
//   hotelRoom: {
//     description: string;
//     images: string[];
//   };
//   hotel: {
//     title: string;
//     description: string;
//   };
// }
//
// @Controller('api')
// export class ReservationsApiController {
//   constructor(
//     private readonly reservationsApiService: ReservationsApiService,
//   ) {}
//
//   //  2.2.1. Бронирование номера клиентом
//   @Post('client/reservations')
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles([Role.Client])
//   async addReservation(
//     @Body() createReservationDto: CreateReservationDto,
//   ): Promise<IReservation> {
//     return this.reservationsApiService.addReservation(createReservationDto);
//   }
//
//   //  2.2.2. Список броней текущего пользователя
//   @Get('client/reservations')
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles([Role.Client])
//   async getReservationsByClient(): Promise<IReservation[]> {
//     return this.reservationsApiService.getReservationsByClient();
//   }
//
//   //  2.2.3. Отмена бронирования клиентом
//   @Delete('client/reservations/:id')
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles([Role.Client])
//   async deleteReservationByClient(
//     @Param('id') id: Types.ObjectId,
//   ): Promise<void> {
//     return this.reservationsApiService.deleteReservationByClient(id);
//   }
//
//   //  2.2.4. Список броней конкретного пользователя
//   @Get('manager/reservations/:userId')
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles([Role.Manager])
//   async getReservationsByManager(
//     @Param('userId') userId: Types.ObjectId,
//   ): Promise<IReservation[]> {
//     return this.reservationsApiService.getReservationsByManager(userId);
//   }
//
//   //  2.2.5. Отмена бронирования менеджером
//   @Delete('manager/reservations/:userId')
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles([Role.Manager])
//   async deleteReservationByManager(
//     @Param('userId') userId: Types.ObjectId,
//   ): Promise<void> {
//     return this.reservationsApiService.deleteReservationByManager(userId);
//   }
// }
