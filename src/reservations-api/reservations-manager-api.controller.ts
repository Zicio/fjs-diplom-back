import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { ReservationsApiService } from './reservations-api.service';
import { Role, Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ID } from '../globalType';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReservationResponseDto } from './dto/reservation-response.dto';
import { GetReservationsDto } from './dto/getReservations.dto';
import { DeleteReservationDto } from './dto/deleteReservation.dto';

@ApiTags('Бронирование | Менеджер')
@Controller('api/manager/reservations')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles([Role.Manager])
export class ReservationsManagerApiController {
  constructor(
    private readonly reservationsApiService: ReservationsApiService,
  ) {}

  //  2.2.4. Список броней конкретного пользователя
  @ApiOperation({ summary: 'Список броней конкретного пользователя' })
  @ApiResponse({ status: 200, type: [ReservationResponseDto] })
  @Get(':userId')
  @ApiParam({ name: 'userId', type: String, required: true, example: '1' })
  async getReservationsByManager(
    @Param('userId') userId: ID,
  ): Promise<ReservationResponseDto[]> {
    const getReservationsDto = new GetReservationsDto(userId);
    return this.reservationsApiService.getReservations(getReservationsDto);
  }

  //  2.2.5. Отмена бронирования менеджером
  @ApiOperation({ summary: 'Отмена бронирования менеджером' })
  @ApiResponse({ status: 204, description: 'Пустой ответ' })
  @Delete(':userId')
  @ApiParam({ name: 'userId', type: String, required: true, example: '1' })
  async deleteReservationByManager(@Param('userId') userId: ID): Promise<void> {
    const deleteReservationDto = new DeleteReservationDto(userId, null);
    return this.reservationsApiService.deleteReservation(deleteReservationDto);
  }
}
