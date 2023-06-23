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
import { Types } from 'mongoose';
import { IGetHotelsBody, IHotel, IRoom, IUpdateRoomBody } from './interfaces';
import { HotelsApiService } from './hotels-api.service';
import { GetHotelsDto } from './dto/getHotels.dto';
import { UpdateRoomDto } from './dto/updateRoom.dto';

@Controller('api/admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles([Role.Admin])
export class HotelsApiAdminController {
  constructor(private readonly hotelsApiService: HotelsApiService) {}

  // 2.1.3. Добавление гостиницы
  @Post('hotels')
  async createHotel(@Body() createHotelDto: CreateHotelDto): Promise<IHotel> {
    return this.hotelsApiService.createHotel(createHotelDto);
  }

  //  2.1.4. Получение списка гостиниц
  @Get('hotels')
  async getHotels(@Query() getHotelsDto: GetHotelsDto): Promise<IHotel[]> {
    return this.hotelsApiService.getHotels(getHotelsDto);
  }

  // 2.1.5. Изменение описания гостиницы
  @Put('hotels/:id')
  async updateHotel(
    @Body() body: IGetHotelsBody,
    @Param('id') hotelId: Types.ObjectId,
  ): Promise<IHotel> {
    const updateHotelDto = new UpdateHotelDto(
      body.title,
      body.description,
      hotelId,
    );
    return this.hotelsApiService.updateHotel(updateHotelDto);
  }

  //  2.1.6. Добавление номера
  @Post('hotel-rooms')
  @UseInterceptors(FilesInterceptor('images', 10, multerOptions))
  async createRoom(
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Body() createRoomDto: CreateRoomDto,
  ): Promise<IRoom> {
    createRoomDto.images = images;
    return this.hotelsApiService.createRoom(createRoomDto);
  }

  //  2.1.7. Изменение описания номера
  @Put('hotel-rooms/:id')
  @UseInterceptors(FilesInterceptor('images', 10, multerOptions))
  async updateRoom(
    @UploadedFiles() uploadImages: Array<Express.Multer.File>,
    @Param('id') roomId: Types.ObjectId,
    @Body()
    body: IUpdateRoomBody,
  ): Promise<IRoom | null> {
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
