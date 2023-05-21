import { Injectable } from '@nestjs/common';
import { HotelsService } from '../hotels/hotels.service';
import { HotelsRoomsService } from '../hotels/hotelsRooms.service';
import {
  IQueryGetHotelsParams,
  IQueryGetRoomsParams,
} from './hotels-api.controller';
import { HotelRoom } from '../hotels/schemas/hotelRoom.schema';
import { Types } from 'mongoose';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { Hotel } from '../hotels/schemas/hotel.schema';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

interface IRoomParams {
  description: string;
  hotel: Types.ObjectId;
  images: string[];
}

@Injectable()
export class HotelsApiService {
  constructor(
    private readonly hotelsService: HotelsService,
    private readonly hotelsRoomsService: HotelsRoomsService,
  ) {}

  // 2.1.1. Поиск номеров
  async getRooms(query: IQueryGetRoomsParams): Promise<HotelRoom[]> {
    return this.hotelsRoomsService.search(query);
  }

  //  2.1.2. Информация о конкретном номере
  async getRoom(id: Types.ObjectId): Promise<HotelRoom | null> {
    return this.hotelsRoomsService.findById(id);
  }

  // 2.1.3. Добавление гостиницы
  async createHotel(createHotelDto: CreateHotelDto) {
    return await this.hotelsService.create(createHotelDto);
  }

  //  2.1.4. Получение списка гостиниц
  async getHotels(query: IQueryGetHotelsParams): Promise<Hotel[]> {
    return this.hotelsService.search(query);
  }

  // 2.1.5. Изменение описания гостиницы
  async updateHotel(id: Types.ObjectId, updateHotelDto: UpdateHotelDto) {
    return this.hotelsService.update(id, updateHotelDto);
  }

  //  2.1.6. Добавление номера
  async createRoom(createRoomDto: CreateRoomDto): Promise<HotelRoom> {
    const { images, ...rest } = createRoomDto;
    const imagesDestinations: string[] = images.map(
      (image: Express.Multer.File) => image.destination,
    );
    const roomParams: IRoomParams = { images: imagesDestinations, ...rest };
    return this.hotelsRoomsService.create(roomParams);
  }

  //  2.1.7. Изменение описания номера TODO: проверить как работает, непонятная игра с файлами изображений
  async updateRoom(
    images: Express.Multer.File[],
    id: Types.ObjectId,
    updateRoomDto: UpdateRoomDto,
  ): Promise<HotelRoom | null> {
    updateRoomDto.images = updateRoomDto.images.filter(
      (image) => typeof image === 'string',
    ) as string[];
    const imagesInStore: string[] = images.map((image) => image.destination);
    updateRoomDto.images.concat(imagesInStore);
    updateRoomDto.images = [...new Set(updateRoomDto.images)] as string[];

    return this.hotelsRoomsService.update(
      id,
      updateRoomDto as {
        description: string;
        hotel: Types.ObjectId;
        isEnabled: boolean;
        images: Array<string>;
      },
    );
  }
}
