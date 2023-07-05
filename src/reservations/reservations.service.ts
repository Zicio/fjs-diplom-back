import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Reservation, ReservationDocument } from './schemas/reservation.schema';
import { InjectModel } from '@nestjs/mongoose';
import { ID } from '../globalType';

interface IReservationDto {
  userId: ID;
  hotelId: ID;
  roomId: ID;
  dateStart: Date;
  dateEnd: Date;
}

interface IReservationSearchOptions {
  userId: ID;
  dateStart: Date;
  dateEnd: Date;
}

interface IReservationService {
  addReservation(data: IReservationDto): Promise<Reservation>;

  removeReservation(id: ID): Promise<void>;

  getReservations(
    filter: IReservationSearchOptions,
  ): Promise<Array<Reservation>>;
}

@Injectable()
export class ReservationsService implements IReservationService {
  constructor(
    @InjectModel(Reservation.name)
    private reservationModel: Model<ReservationDocument>,
  ) {}

  async addReservation(data: IReservationDto): Promise<Reservation> {
    const query = {
      roomId: data.roomId,
      $and: [
        { dateStart: { $lte: data.dateStart } },
        { dateEnd: { $gt: data.dateStart } },
      ],
    };
    const reservations = await this.reservationModel.find(query);
    if (reservations.length > 0) {
      throw new Error('Данный номер не доступен на заданную дату');
    }
    const reservation = new this.reservationModel(data);
    return reservation.save();
  }

  async removeReservation(id: ID): Promise<void> {
    await this.reservationModel.findByIdAndDelete(id);
  }

  async getReservations(
    filter: IReservationSearchOptions,
  ): Promise<Array<Reservation>> {
    return this.reservationModel.find(filter);
  }
}
