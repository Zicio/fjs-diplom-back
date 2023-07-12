import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { isEnabledGuard } from 'src/auth/guards/is-enabled.guard';
import { Role, Roles } from '../auth/roles.decorator';

import { HotelsApiService } from './hotels-api.service';
import { GetRoomsDto } from './dto/getRooms.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoomResponseDto } from './dto/room-response.dto';
import { GetRoomsQueryDto } from './dto/getRooms-query.dto';
import { ID } from '../globalType';

@ApiTags('Работа с гостиницами')
@Controller('api/common')
export class HotelsApiCommonController {
  constructor(private readonly hotelsApiService: HotelsApiService) {}

  // 2.1.1. Поиск номеров
  @ApiOperation({ summary: 'Поиск номеров' })
  @ApiResponse({ status: 200, type: [RoomResponseDto] })
  @Get('hotel-rooms')
  @UseGuards(isEnabledGuard)
  @Roles([Role.Client])
  async getRooms(
    @Query()
    query: GetRoomsQueryDto,
    @Req() request: Request & { isEnabled: boolean },
  ): Promise<RoomResponseDto[]> {
    const isEnabled: boolean | undefined = request.isEnabled;
    const getRoomsDto = new GetRoomsDto(query, isEnabled);
    return this.hotelsApiService.getRooms(getRoomsDto);
  }

  // 2.1.2. Информация о конкретном номере
  @ApiOperation({ summary: 'Информация о конкретном номере' })
  @ApiResponse({ status: 200, type: RoomResponseDto })
  @Get('hotel-rooms/:id')
  @ApiParam({ name: 'id', type: String, required: true, example: '1' })
  async getRoom(@Param('id') id: ID): Promise<RoomResponseDto> {
    return this.hotelsApiService.getRoom(id);
  }
}
