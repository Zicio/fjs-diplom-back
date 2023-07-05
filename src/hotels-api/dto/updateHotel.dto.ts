import { ID } from '../../globalType';

export class UpdateHotelDto {
  readonly title: string;
  readonly description: string;
  readonly hotel: ID;

  constructor(title: string, description: string, hotel: ID) {
    this.title = title;
    this.description = description;
    this.hotel = hotel;
  }
}
