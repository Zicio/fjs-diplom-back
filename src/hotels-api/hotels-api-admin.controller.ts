import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role, Roles } from '../auth/roles.decorator';
import { CreateHotelDto } from './dto/createHotel.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import multerOptions from '../../config/multerOptions';
import { CreateRoomDto } from './dto/createRoom.dto';
import { UpdateHotelDto } from './dto/updateHotel.dto';
import { HotelsApiService } from './hotels-api.service';
import { GetHotelsQueryDto } from './dto/getHotels-query.dto';
import { UpdateRoomDto } from './dto/updateRoom.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HotelResponseDto } from './dto/hotel-response.dto';
import { RoomResponseDto } from './dto/room-response.dto';
import { GetHotelsBodyDto } from './dto/getHotels-body.dto';
import { UpdateRoomBodyDto } from './dto/updateRoom-body.dto';
import { ID } from '../globalType';

@ApiTags('Работа с гостиницами | Администратор')
@Controller('api/admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles([Role.Admin])
export class HotelsApiAdminController {
  constructor(private readonly hotelsApiService: HotelsApiService) {}

  // 2.1.3. Добавление гостиницы
  @ApiOperation({ summary: 'Добавление гостиницы' })
  @ApiResponse({ status: 201, type: HotelResponseDto })
  @Post('hotels')
  async createHotel(
    @Body() createHotelDto: CreateHotelDto,
  ): Promise<HotelResponseDto> {
    return this.hotelsApiService.createHotel(createHotelDto);
  }

  //  2.1.4. Получение списка гостиниц
  @ApiOperation({ summary: 'Получение списка гостиниц' })
  @ApiResponse({ status: 200, type: [HotelResponseDto] })
  @Get('hotels')
  async getHotels(
    @Query() getHotelsDto: GetHotelsQueryDto,
  ): Promise<HotelResponseDto[]> {
    return this.hotelsApiService.getHotels(getHotelsDto);
  }

  // 2.1.5. Изменение описания гостиницы
  @ApiOperation({ summary: 'Изменение описания гостиницы' })
  @ApiResponse({ status: 200, type: HotelResponseDto })
  @Put('hotels/:id')
  @ApiParam({ name: 'id', type: String, required: true, example: '1' })
  async updateHotel(
    @Body() body: GetHotelsBodyDto,
    @Param('id') hotelId: ID,
  ): Promise<HotelResponseDto> {
    const updateHotelDto = new UpdateHotelDto(
      body.title,
      body.description,
      hotelId,
    );
    return this.hotelsApiService.updateHotel(updateHotelDto);
  }

  //  2.1.6. Добавление номера
  @ApiOperation({ summary: 'Добавление номера' })
  @ApiResponse({ status: 201, type: RoomResponseDto })
  @Post('hotel-rooms')
  @UseInterceptors(FilesInterceptor('images', 10, multerOptions))
  async createRoom(
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Body() createRoomDto: CreateRoomDto,
  ): Promise<RoomResponseDto> {
    createRoomDto.images = images;
    return this.hotelsApiService.createRoom(createRoomDto);
  }

  //  2.1.7. Изменение описания номера
  @ApiOperation({ summary: 'Изменение описания номера' })
  @ApiResponse({ status: 200, type: RoomResponseDto })
  @Put('hotel-rooms/:id')
  @ApiParam({ name: 'id', type: String, required: true, example: '1' })
  @UseInterceptors(FilesInterceptor('images', 10, multerOptions))
  async updateRoom(
    @UploadedFiles() uploadImages: Array<Express.Multer.File>,
    @Param('id') roomId: ID,
    @Body()
    body: UpdateRoomBodyDto,
  ): Promise<RoomResponseDto | null> {
    const newImagesFilenames: string[] = uploadImages.map(
      (image: Express.Multer.File) => image.filename,
    );
    body.images = body.images
      ? body.images.concat(newImagesFilenames)
      : newImagesFilenames;
    const updateRoomDto = new UpdateRoomDto(roomId, body);
    return this.hotelsApiService.updateRoom(updateRoomDto);
  }
}
