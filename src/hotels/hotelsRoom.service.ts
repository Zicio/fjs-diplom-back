import { Injectable } from '@nestjs/common';
import { HotelRoom, HotelRoomDocument } from './schemas/hotelRoom.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

interface SearchRoomsParams {
  limit: number;
  offset: number;
  hotel: string;
  isEnabled?: boolean;
}

interface IHotelRoomService {
  create(data: Partial<HotelRoom>): Promise<HotelRoom>;

  findById(id: Types.ObjectId): Promise<HotelRoom | null>;

  search(params: SearchRoomsParams): Promise<HotelRoom[]>;

  update(
    id: Types.ObjectId,
    data: Partial<HotelRoom>,
  ): Promise<HotelRoom | null>;
}

@Injectable()
export class HotelsRoomService implements IHotelRoomService {
  constructor(
    @InjectModel(HotelRoom.name)
    private hotelRoomModel: Model<HotelRoomDocument>,
  ) {}

  async create(data: Partial<HotelRoom>): Promise<HotelRoom> {
    const hotelRoom = new this.hotelRoomModel(data);
    return hotelRoom.save();
  }

  async findById(id: Types.ObjectId): Promise<HotelRoom | null> {
    return this.hotelRoomModel.findById(id);
  }

  async search(params: SearchRoomsParams): Promise<HotelRoom[]> {
    const { limit, offset, hotel, isEnabled } = params;
    const query = this.hotelRoomModel.find({ hotel });

    if (isEnabled) {
      query.where('isEnabled').equals(isEnabled);
    }

    return query.skip(offset).limit(limit);
  }

  async update(
    id: Types.ObjectId,
    data: Partial<HotelRoom>,
  ): Promise<HotelRoom | null> {
    return this.hotelRoomModel.findByIdAndUpdate(id, data, { new: true });
  }
}
