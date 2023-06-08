import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Role, Roles } from '../auth/roles.decorator';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateRoomDto } from './dto/create-room.dto';
import { HotelsApiService } from './hotels-api.service';
import multerOptions from '../../config/multerOptions';
import { UpdateRoomDto } from './dto/update-room.dto';
import { isEnabledGuard } from '../auth/isEnabled.guard';

export interface IQueryGetRoomsParams {
  limit: number;
  offset: number;
  hotel: Types.ObjectId;
}

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

export interface IRoom {
  id: Types.ObjectId;
  description: string;
  images: string[];
  isEnabled?: boolean;
  hotel: {
    id: Types.ObjectId;
    title: string;
    description?: string;
  };
}

@Controller('api')
export class HotelsApiController {
  constructor(private readonly hotelsApiService: HotelsApiService) {}

  // 2.1.1. Поиск номеров
  @Get('common/hotel-rooms')
  @UseGuards(isEnabledGuard)
  @Roles(Role.Client)
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
  @Get('common/hotel-rooms/:id')
  async getRoom(@Param('id') id: Types.ObjectId): Promise<IRoom> {
    return this.hotelsApiService.getRoom(id);
  }

  // 2.1.3. Добавление гостиницы
  @Post('admin/hotels')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async createHotel(@Body() createHotelDto: CreateHotelDto): Promise<IHotel> {
    return this.hotelsApiService.createHotel(createHotelDto);
  }

  //  2.1.4. Получение списка гостиниц
  @Get('admin/hotels')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async getHotels(@Query() query: IQueryGetHotelsParams): Promise<IHotel[]> {
    return this.hotelsApiService.getHotels(query);
  }

  // 2.1.5. Изменение описания гостиницы
  @Put('admin/hotels/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async updateHotel(
    @Body() updateHotelDto: UpdateHotelDto,
    @Param('id') id: Types.ObjectId,
  ): Promise<IHotel> {
    return this.hotelsApiService.updateHotel(id, updateHotelDto);
  }

  //  2.1.6. Добавление номера
  @Post('admin/hotel-rooms')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @UseInterceptors(FilesInterceptor('images', 10, multerOptions))
  async createRoom(
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Body() createRoomDto: CreateRoomDto,
  ) {
    createRoomDto.images = images;
    return this.hotelsApiService.createRoom(createRoomDto);
  }

  //  2.1.7. Изменение описания номера
  @Put('admin/hotel-rooms/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @UseInterceptors(FilesInterceptor('images', 10, multerOptions))
  async updateRoom(
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Param('id') id: Types.ObjectId,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    const newImagesFilenames: string[] = images.map(
      (image: Express.Multer.File) => image.filename,
    );
    updateRoomDto.images = updateRoomDto.images
      ? updateRoomDto.images.concat(newImagesFilenames)
      : newImagesFilenames;
    return this.hotelsApiService.updateRoom(id, updateRoomDto);
  }
}
