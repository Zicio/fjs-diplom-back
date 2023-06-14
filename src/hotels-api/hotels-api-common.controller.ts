import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { isEnabledGuard } from 'src/auth/guards/isEnabled.guard';
import { Role, Roles } from '../auth/roles.decorator';
import { Types } from 'mongoose';

import { IQueryGetRoomsParams, IRoom } from './interfaces';
import { HotelsApiService } from './hotels-api.service';

@Controller('api/common')
export class HotelsApiCommonController {
  constructor(private readonly hotelsApiService: HotelsApiService) {}

  // 2.1.1. Поиск номеров
  @Get('hotel-rooms')
  @UseGuards(isEnabledGuard)
  @Roles([Role.Client])
  async getRooms(
    @Query() query: IQueryGetRoomsParams,
    @Req() request: Request,
  ): Promise<IRoom[]> {
    const isEnabled: boolean | undefined = (
      request as Request & { isEnabled: boolean }
    ).isEnabled;
    return this.hotelsApiService.getRooms(query, isEnabled);
  }

  // 2.1.2. Информация о конкретном номере
  @Get('hotel-rooms/:id')
  async getRoom(@Param('id') id: Types.ObjectId): Promise<IRoom> {
    return this.hotelsApiService.getRoom(id);
  }
}
