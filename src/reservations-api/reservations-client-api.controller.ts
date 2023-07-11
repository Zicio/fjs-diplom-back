import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ReservationsApiService } from './reservations-api.service';
import { Role, Roles } from '../auth/roles.decorator';
import { AddReservationBodyDto } from './dto/addReservation-body.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ReservationResponseDto } from './dto/reservation-response.dto';
import { Request } from 'express';
import { UserDocument } from '../users/schemas/user.schema';
import { AddReservationDto } from './dto/addReservation.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetReservationsDto } from './dto/getReservations.dto';
import { ID } from '../globalType';
import { DeleteReservationDto } from './dto/deleteReservation.dto';

@ApiTags('Бронирование | Клиент')
@Controller('api/client/reservations')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles([Role.Client])
export class ReservationsClientApiController {
  constructor(
    private readonly reservationsApiService: ReservationsApiService,
  ) {}

  //  2.2.1. Бронирование номера клиентом
  @ApiOperation({ summary: 'Бронирование номера клиентом' })
  @ApiResponse({ status: 201, type: ReservationResponseDto })
  @Post()
  async addReservation(
    @Body() body: AddReservationBodyDto,
    @Req() req: Request & { user: UserDocument },
  ): Promise<ReservationResponseDto> {
    const addReservationDto = new AddReservationDto(req.user.id, body);
    return this.reservationsApiService.addReservation(addReservationDto);
  }

  //  2.2.2. Список броней текущего пользователя
  @ApiOperation({ summary: 'Список броней текущего пользователя' })
  @ApiResponse({ status: 200, type: [ReservationResponseDto] })
  @Get()
  async getReservations(
    @Req() req: Request & { user: UserDocument },
  ): Promise<ReservationResponseDto[]> {
    const getReservationsDto = new GetReservationsDto(req.user.id);
    return this.reservationsApiService.getReservations(getReservationsDto);
  }

  //  2.2.3. Отмена бронирования клиентом
  @ApiOperation({ summary: 'Отмена бронирования клиентом' })
  @ApiResponse({ status: 204, description: 'Пустой ответ' })
  @Delete(':id')
  async deleteReservation(
    @Param('id') id: ID,
    @Req() req: Request & { user: UserDocument },
  ): Promise<void> {
    const deleteReservationDto = new DeleteReservationDto(id, req.user.id);
    return this.reservationsApiService.deleteReservation(deleteReservationDto);
  }
}
