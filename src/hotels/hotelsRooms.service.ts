import { Injectable } from '@nestjs/common';
import { HotelRoom, HotelRoomDocument } from './schemas/hotelRoom.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

interface ISearchRoomsParams {
  limit: number;
  offset: number;
  hotel: Types.ObjectId;
  isEnabled?: boolean;
}

interface IHotelsRoomsService {
  create(data: Partial<HotelRoom>): Promise<HotelRoom>;

  findById(id: Types.ObjectId): Promise<HotelRoom | null>;

  search(params: ISearchRoomsParams): Promise<HotelRoom[]>;

  update(
    id: Types.ObjectId,
    data: Partial<HotelRoom>,
  ): Promise<HotelRoom | null>;
}

@Injectable()
export class HotelsRoomsService implements IHotelsRoomsService {
  constructor(
    @InjectModel(HotelRoom.name)
    private hotelRoomModel: Model<HotelRoomDocument>,
  ) {}

  async create(data: Partial<HotelRoom>): Promise<HotelRoom> {
    return new this.hotelRoomModel(data).save();
  }

  async findById(id: Types.ObjectId): Promise<HotelRoom | null> {
    return this.hotelRoomModel
      .findById(id)
      .populate('hotel', 'id title description');
  }

  async search(params: ISearchRoomsParams): Promise<HotelRoom[]> {
    const { limit, offset, hotel, isEnabled } = params;
    const query = this.hotelRoomModel.find({ hotel });
    if (isEnabled === true) {
      query.where('isEnabled').equals(isEnabled);
    }
    query.populate('hotel', 'id title');
    return query.skip(offset).limit(limit);
  }

  async update(
    id: Types.ObjectId,
    data: Partial<HotelRoom>,
  ): Promise<HotelRoom | null> {
    const query = this.hotelRoomModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    query.populate('hotel', 'id title description');
    return query;
  }
}
