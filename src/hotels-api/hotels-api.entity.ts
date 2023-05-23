import { Exclude } from 'class-transformer';
import { Types } from 'mongoose';

export class HotelRoomEntity {
  hotel: {
    id: Types.ObjectId;
    title: string;
    description: string;
  };
  description: string;
  images: string[];
  isEnabled: boolean;
  id: Types.ObjectId;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor(partial: Partial<HotelRoomEntity>) {
    Object.assign(this, partial);
  }
}
