import { ID } from '../../globalType';

export class UpdateRoomDto {
  readonly room: ID;
  readonly description: string;
  readonly hotel: ID;
  readonly isEnabled: boolean;
  readonly images: Array<Express.Multer.File | string>;

  constructor(
    room: ID,
    query: {
      description: string;
      hotel: ID;
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
