import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { isEnabledGuard } from 'src/auth/guards/isEnabled.guard';
import { Role, Roles } from '../../auth/roles.decorator';
import { Types } from 'mongoose';
import { HotelsApiCommonService } from './hotels-api-common.service';
import { IRoom } from '../shared-interfaces/interfaces';
import { IQueryGetRoomsParams } from './interfaces';

@Controller('api/common')
export class HotelsApiCommonController {
  constructor(
    private readonly hotelsApiCommonService: HotelsApiCommonService,
  ) {}

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
    return this.hotelsApiCommonService.getRooms(query, isEnabled);
  }

  // 2.1.2. Информация о конкретном номере
  @Get('hotel-rooms/:id')
  async getRoom(@Param('id') id: Types.ObjectId): Promise<IRoom> {
    return this.hotelsApiCommonService.getRoom(id);
  }
}
