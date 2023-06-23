import { Types } from 'mongoose';

export class UpdateRoomDto {
  readonly room: Types.ObjectId;
  readonly description: string;
  readonly hotel: Types.ObjectId;
  readonly isEnabled: boolean;
  readonly images: Array<Express.Multer.File | string>;

  constructor(
    room: Types.ObjectId,
    query: {
      description: string;
      hotel: Types.ObjectId;
      isEnabled: boolean;
      images: Array<Express.Multer.File | string>;
    },
  ) {
    const { description, hotel, isEnabled, images } = query;
    this.room = room;
    this.description = description;
    this.hotel = hotel;
    this.isEnabled = isEnabled;
    this.images = images;
  }
}
