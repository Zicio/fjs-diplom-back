import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { HotelsService } from '../../hotels/hotels.service';
import { HotelsRoomsService } from '../../hotels/hotelsRooms.service';
import { HotelRoomDocument } from '../../hotels/schemas/hotelRoom.schema';
import { HotelDocument } from '../../hotels/schemas/hotel.schema';
import { Types } from 'mongoose';
import { IQueryGetRoomsParams } from './interfaces';
import { IRoom } from '../shared-interfaces/interfaces';

@Injectable()
export class HotelsApiCommonService {
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
}
