import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ReservationsApiService } from './reservations-api.service';
import { Role, Roles } from '../auth/roles.decorator';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Types } from 'mongoose';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('api/client/reservations')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles([Role.Client])
export class ReservationsClientApiController {
  constructor(
    private readonly reservationsApiService: ReservationsApiService,
  ) {}

  //  2.2.1. Бронирование номера клиентом
  @Post('client/reservations')
  async addReservation(@Body() createReservationDto: CreateReservationDto) {
    return 'Hello World!';
    // return this.reservationsApiService.addReservation(createReservationDto);
  }

  //  2.2.2. Список броней текущего пользователя
  @Get('client/reservations')
  async getReservationsByClient() /*: Promise<IReservation[]>*/ {
    return 'Hello World!';
    // return this.reservationsApiService.getReservationsByClient();
  }

  //  2.2.3. Отмена бронирования клиентом
  @Delete('client/reservations/:id')
  async deleteReservationByClient(
    @Param('id') id: Types.ObjectId,
  ) /*: Promise<void>*/ {
    return 'Hello World!';
    // return this.reservationsApiService.deleteReservationByClient(id);
  }
}
