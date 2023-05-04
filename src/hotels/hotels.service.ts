import { Injectable } from '@nestjs/common';
import { Hotel, HotelDocument } from './schemas/hotel.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

interface SearchHotelParams {
  limit: number;
  offset: number;
  title: string;
}

interface UpdateHotelParams {
  title: string;
  description: string;
}

interface IHotelService {
  create(data: any): Promise<Hotel>;

  findById(id: Types.ObjectId): Promise<Hotel | null>;

  search(params: SearchHotelParams): Promise<Hotel[]>;

  update(id: Types.ObjectId, data: UpdateHotelParams): Promise<Hotel | null>;
}

@Injectable()
export class HotelsService implements IHotelService {
  constructor(
    @InjectModel(Hotel.name) private hotelModel: Model<HotelDocument>,
  ) {}

  async create(data: any): Promise<Hotel> {
    const hotel = new this.hotelModel(data);
    return hotel.save();
  }

  async findById(id: Types.ObjectId): Promise<Hotel | null> {
    return this.hotelModel.findById(id);
  }

  async search(params: SearchHotelParams): Promise<Hotel[]> {
    const { limit, offset, title } = params;
    const query = {
      title: { $regex: new RegExp(title, 'i') },
    };
    return this.hotelModel.find(query).limit(limit).skip(offset);
  }

  async update(
    id: Types.ObjectId,
    data: UpdateHotelParams,
  ): Promise<Hotel | null> {
    return this.hotelModel.findByIdAndUpdate(id, data, { new: true });
  }
}
