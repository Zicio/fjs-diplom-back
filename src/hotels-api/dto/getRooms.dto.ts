import { Types } from 'mongoose';

export class GetRoomsDto {
  readonly hotel: Types.ObjectId;
  readonly limit?: number;
  readonly offset?: number;
  readonly isEnabled?: boolean;

  constructor(
    query: {
      hotel: Types.ObjectId;
      limit?: number;
      offset?: number;
    },
    isEnabled?: boolean,
  ) {
    const { hotel, limit, offset } = query;
    this.hotel = hotel;
    this.limit = limit;
    this.offset = offset;
    this.isEnabled = isEnabled;
  }
}
