import { ID } from '../../globalType';

export class GetRoomsDto {
  readonly hotel: ID;
  readonly limit?: number;
  readonly offset?: number;
  readonly isEnabled?: boolean;

  constructor(
    query: {
      hotel: ID;
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
