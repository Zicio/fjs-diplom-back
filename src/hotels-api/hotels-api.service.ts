import { Injectable } from '@nestjs/common';
import { HotelsService } from '../hotels/hotels.service';
import { HotelsRoomsService } from '../hotels/hotelsRooms.service';
import {
  IHotel,
  IQueryGetHotelsParams,
  IQueryGetRoomsParams,
} from './hotels-api.controller';
import {
  HotelRoom,
  HotelRoomDocument,
} from '../hotels/schemas/hotelRoom.schema';
import { Types } from 'mongoose';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { Hotel, HotelDocument } from '../hotels/schemas/hotel.schema';
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
  async createHotel(createHotelDto: CreateHotelDto): Promise<IHotel> {
    const { id, title, description } = (await this.hotelsService.create(
      createHotelDto,
    )) as HotelDocument;
    return {
      id,
      title,
      description,
    };
  }

  //  2.1.4. Получение списка гостиниц
  async getHotels(query: IQueryGetHotelsParams): Promise<IHotel[]> {
    const hotels = (await this.hotelsService.search(query)) as HotelDocument[];
    return hotels.map((hotel) => {
      const { id, title, description } = hotel;
      return {
        id,
        title,
        description,
      };
    });
  }

  // 2.1.5. Изменение описания гостиницы
  async updateHotel(
    id: Types.ObjectId,
    updateHotelDto: UpdateHotelDto,
  ): Promise<IHotel> {
    const {
      id: hotelId,
      title,
      description,
    } = (await this.hotelsService.update(id, updateHotelDto)) as HotelDocument;
    return {
      id: hotelId,
      title,
      description,
    };
  }

  //  2.1.6. Добавление номера
  async createRoom(createRoomDto: CreateRoomDto) {
    const { images, ...rest } = createRoomDto;
    const imagesDestinations: string[] = images.map(
      (image: Express.Multer.File) => image.filename,
    );
    const roomParams: IRoomParams = { images: imagesDestinations, ...rest };
    const room = (await this.hotelsRoomsService.create(
      roomParams,
    )) as HotelRoomDocument;
    const hotel = (await this.hotelsService.findById(
      roomParams.hotel,
    )) as Hotel;
    return {
      id: room.id,
      description: room.description,
      images: room.images,
      hotel: {
        id: room.hotel,
        title: hotel.title,
        description: hotel.description,
      },
    };
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