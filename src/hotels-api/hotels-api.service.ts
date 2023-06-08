import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { HotelsService } from '../hotels/hotels.service';
import { HotelsRoomsService } from '../hotels/hotelsRooms.service';
import {
  IHotel,
  IQueryGetHotelsParams,
  IQueryGetRoomsParams,
  IRoom,
} from './hotels-api.controller';
import { HotelRoomDocument } from '../hotels/schemas/hotelRoom.schema';
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
  async getRooms(
    query: IQueryGetRoomsParams,
    isEnabled: boolean | undefined,
  ): Promise<IRoom[]> {
    try {
      const rooms = (await this.hotelsRoomsService.search({
        isEnabled,
        ...query,
      })) as (HotelRoomDocument & { hotel: HotelDocument })[];
      return rooms.map((room) => {
        const { id, description, images, hotel } = room;
        return {
          id,
          description,
          images,
          hotel: {
            id: hotel.id,
            title: hotel.title,
          },
        };
      });
    } catch (e) {
      throw new InternalServerErrorException('Ошибка при поиске номеров');
    }
  }

  //  2.1.2. Информация о конкретном номере
  async getRoom(id: Types.ObjectId): Promise<IRoom> {
    try {
      const {
        id: roomId,
        description,
        images,
        hotel,
      } = (await this.hotelsRoomsService.findById(id)) as HotelRoomDocument & {
        hotel: HotelDocument;
      };
      return {
        id: roomId,
        description,
        images,
        hotel: {
          id: hotel.id,
          description: hotel.description,
          title: hotel.title,
        },
      };
    } catch (e) {
      throw new NotFoundException('Комната отеля не найдена');
    }
  }

  // 2.1.3. Добавление гостиницы
  async createHotel(createHotelDto: CreateHotelDto): Promise<IHotel> {
    try {
      const { id, title, description } = (await this.hotelsService.create(
        createHotelDto,
      )) as HotelDocument;
      return {
        id,
        title,
        description,
      };
    } catch (e) {
      throw new InternalServerErrorException('Ошибка при создании гостиницы');
    }
  }

  //  2.1.4. Получение списка гостиниц
  async getHotels(query: IQueryGetHotelsParams): Promise<IHotel[]> {
    try {
      const hotels = (await this.hotelsService.search(
        query,
      )) as HotelDocument[];
      return hotels.map((hotel) => {
        const { id, title, description } = hotel;
        return {
          id,
          title,
          description,
        };
      });
    } catch (e) {
      throw new InternalServerErrorException('Ошибка при поиске гостиниц');
    }
  }

  // 2.1.5. Изменение описания гостиницы
  async updateHotel(
    id: Types.ObjectId,
    updateHotelDto: UpdateHotelDto,
  ): Promise<IHotel> {
    try {
      const {
        id: hotelId,
        title,
        description,
      } = (await this.hotelsService.update(
        id,
        updateHotelDto,
      )) as HotelDocument;
      return {
        id: hotelId,
        title,
        description,
      };
    } catch (e) {
      throw new InternalServerErrorException(
        'Ошибка при изменении описания гостиницы',
      );
    }
  }

  //  2.1.6. Добавление номера
  async createRoom(createRoomDto: CreateRoomDto) {
    try {
      const { images, ...rest } = createRoomDto;
      const imagesFilenames: string[] = images.map(
        (image: Express.Multer.File) => image.filename,
      );
      const roomParams: IRoomParams = { images: imagesFilenames, ...rest };
      const room = (await this.hotelsRoomsService.create(
        roomParams,
      )) as HotelRoomDocument;
      const hotel = (await this.hotelsService.findById(
        roomParams.hotel,
      )) as Hotel;
      if (!hotel) {
        throw new NotFoundException('Гостиница с таким id отсутствует');
      }
      return {
        id: room.id,
        description: room.description,
        isEnabled: room.isEnabled,
        images: room.images,
        hotel: {
          id: room.hotel,
          title: hotel.title,
          description: hotel.description,
        },
      };
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new InternalServerErrorException('Ошибка при создании номера');
    }
  }

  //  2.1.7. Изменение описания номера TODO: проверить как работает
  async updateRoom(
    id: Types.ObjectId,
    updateRoomDto: UpdateRoomDto,
  ): Promise<IRoom | null> {
    try {
      const {
        id: roomId,
        description,
        images,
        isEnabled,
        hotel,
      } = (await this.hotelsRoomsService.update(
        id,
        updateRoomDto as {
          description: string;
          hotel: Types.ObjectId;
          isEnabled: boolean;
          images: Array<string>;
        },
      )) as HotelRoomDocument & { hotel: HotelDocument };
      console.log(id);
      return {
        id: roomId,
        description,
        images,
        isEnabled,
        hotel: {
          id: hotel.id,
          description: hotel.description,
          title: hotel.title,
        },
      };
    } catch (e) {
      throw new InternalServerErrorException(
        'Ошибка при изменении описания номера',
      );
    }
  }
}
