import { Types } from 'mongoose';

export class UpdateHotelDto {
  readonly title: string;
  readonly description: string;
  readonly hotel: Types.ObjectId;

  constructor(title: string, description: string, hotel: Types.ObjectId) {
    this.title = title;
    this.description = description;
    this.hotel = hotel;
  }
}
