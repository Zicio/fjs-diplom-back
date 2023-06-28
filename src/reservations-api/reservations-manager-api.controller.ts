import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { ReservationsApiService } from './reservations-api.service';
import { Role, Roles } from '../auth/roles.decorator';
import { Types } from 'mongoose';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('api/manager/reservations')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles([Role.Manager])
export class ReservationsManagerApiController {
  constructor(
    private readonly reservationsApiService: ReservationsApiService,
  ) {}

  //  2.2.4. Список броней конкретного пользователя
  @Get('manager/reservations/:userId')
  async getReservationsByManager(
    @Param('userId') userId: Types.ObjectId,
  ) /*: Promise<IReservation[]>*/ {
    return 'Hello World!';
    // return this.reservationsApiService.getReservationsByManager(userId);
  }

  //  2.2.5. Отмена бронирования менеджером
  @Delete('manager/reservations/:userId')
  async deleteReservationByManager(
    @Param('userId') userId: Types.ObjectId,
  ) /*: Promise<void>*/ {
    return 'Hello World!';
    // return this.reservationsApiService.deleteReservationByManager(userId);
  }
}
