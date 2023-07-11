import { ID } from '../../globalType';

export class GetReservationsDto {
  readonly user: ID;

  constructor(id: ID) {
    this.user = id;
  }
}
