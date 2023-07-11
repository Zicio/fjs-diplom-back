import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { ReservationsApiService } from './reservations-api.service';
import { Role, Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ID } from '../globalType';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Бронирование | Менеджер')
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
    @Param('userId') userId: ID,
  ) /*: Promise<IReservation[]>*/ {
    return 'Hello World!';
    // return this.reservationsApiService.getReservationsByManager(userId);
  }

  //  2.2.5. Отмена бронирования менеджером
  @Delete('manager/reservations/:userId')
  async deleteReservationByManager(
    @Param('userId') userId: ID,
  ) /*: Promise<void>*/ {
    return 'Hello World!';
    // return this.reservationsApiService.deleteReservationByManager(userId);
  }
}
