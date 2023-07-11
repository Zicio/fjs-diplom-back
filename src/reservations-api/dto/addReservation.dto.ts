import { ID } from '../../globalType';
import { AddReservationBodyDto } from './addReservation-body.dto';

export class AddReservationDto {
  readonly user: ID;
  readonly room: ID;
  readonly startDate: string;
  readonly endDate: string;

  constructor(userId: ID, body: AddReservationBodyDto) {
    const { room, startDate, endDate } = body;
    this.user = userId;
    this.room = room;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}
