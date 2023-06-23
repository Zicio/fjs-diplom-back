import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { isEnabledGuard } from 'src/auth/guards/isEnabled.guard';
import { Role, Roles } from '../auth/roles.decorator';
import { Types } from 'mongoose';

import { IQueryGetRoomsParams, IRoom } from './interfaces';
import { HotelsApiService } from './hotels-api.service';
import { GetRoomsDto } from './dto/getRooms.dto';

@Controller('api/common')
export class HotelsApiCommonController {
  constructor(private readonly hotelsApiService: HotelsApiService) {}

  // 2.1.1. Поиск номеров
  @Get('hotel-rooms')
  @UseGuards(isEnabledGuard)
  @Roles([Role.Client])
  async getRooms(
    @Query()
    query: IQueryGetRoomsParams,
    @Req() request: Request & { isEnabled: boolean },
  ): Promise<IRoom[]> {
    const isEnabled: boolean | undefined = request.isEnabled;
    const getRoomsDto = new GetRoomsDto(query, isEnabled);
    return this.hotelsApiService.getRooms(getRoomsDto);
  }

  // 2.1.2. Информация о конкретном номере
  @Get('hotel-rooms/:id')
  async getRoom(@Param('id') id: Types.ObjectId): Promise<IRoom> {
    return this.hotelsApiService.getRoom(id);
  }
}
