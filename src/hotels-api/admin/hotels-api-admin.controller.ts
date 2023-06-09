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
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Role, Roles } from '../../auth/roles.decorator';
import { CreateHotelDto } from '../dto/create-hotel.dto';
import { UpdateRoomDto } from '../dto/update-room.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import multerOptions from '../../../config/multerOptions';
import { CreateRoomDto } from '../dto/create-room.dto';
import { UpdateHotelDto } from '../dto/update-hotel.dto';
import { Types } from 'mongoose';

import { HotelsApiAdminService } from './hotels-api-admin.service';
import { IRoom } from '../shared-interfaces/interfaces';

export interface IQueryGetHotelsParams {
  limit: number;
  offset: number;
  title: string;
}

export interface IHotel {
  id: Types.ObjectId;
  title: string;
  description: string;
}

@Controller('api/admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles([Role.Admin])
export class HotelsApiAdminController {
  constructor(private readonly hotelsApiAdminService: HotelsApiAdminService) {}

  // 2.1.3. Добавление гостиницы
  @Post('hotels')
  async createHotel(@Body() createHotelDto: CreateHotelDto): Promise<IHotel> {
    return this.hotelsApiAdminService.createHotel(createHotelDto);
  }

  //  2.1.4. Получение списка гостиниц
  @Get('hotels')
  async getHotels(@Query() query: IQueryGetHotelsParams): Promise<IHotel[]> {
    return this.hotelsApiAdminService.getHotels(query);
  }

  // 2.1.5. Изменение описания гостиницы
  @Put('hotels/:id')
  async updateHotel(
    @Body() updateHotelDto: UpdateHotelDto,
    @Param('id') id: Types.ObjectId,
  ): Promise<IHotel> {
    return this.hotelsApiAdminService.updateHotel(id, updateHotelDto);
  }

  //  2.1.6. Добавление номера
  @Post('hotel-rooms')
  @UseInterceptors(FilesInterceptor('images', 10, multerOptions))
  async createRoom(
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Body() createRoomDto: CreateRoomDto,
  ): Promise<IRoom> {
    createRoomDto.images = images;
    return this.hotelsApiAdminService.createRoom(createRoomDto);
  }

  //  2.1.7. Изменение описания номера
  @Put('hotel-rooms/:id')
  @UseInterceptors(FilesInterceptor('images', 10, multerOptions))
  async updateRoom(
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Param('id') id: Types.ObjectId,
    @Body() updateRoomDto: UpdateRoomDto,
  ): Promise<IRoom | null> {
    const newImagesFilenames: string[] = images.map(
      (image: Express.Multer.File) => image.filename,
    );
    updateRoomDto.images = updateRoomDto.images
      ? updateRoomDto.images.concat(newImagesFilenames)
      : newImagesFilenames;
    return this.hotelsApiAdminService.updateRoom(id, updateRoomDto);
  }
}
