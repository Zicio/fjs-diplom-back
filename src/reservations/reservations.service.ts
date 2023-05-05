import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { Reservation, ReservationDocument } from './schemas/reservation.schema';
import { InjectModel } from '@nestjs/mongoose';

interface ReservationDto {
  userId: Types.ObjectId;
  hotelId: Types.ObjectId;
  roomId: Types.ObjectId;
  dateStart: Date;
  dateEnd: Date;
}

interface ReservationSearchOptions {
  userId: Types.ObjectId;
  dateStart: Date;
  dateEnd: Date;
}

interface IReservationService {
  addReservation(data: ReservationDto): Promise<Reservation>;

  removeReservation(id: Types.ObjectId): Promise<void>;

  getReservations(
    filter: ReservationSearchOptions,
  ): Promise<Array<Reservation>>;
}

@Injectable()
export class ReservationsService implements IReservationService {
  constructor(
    @InjectModel(Reservation.name)
    private reservationModel: Model<ReservationDocument>,
  ) {}

  async addReservation(data: ReservationDto): Promise<Reservation> {
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

  async removeReservation(id: Types.ObjectId): Promise<void> {
    await this.reservationModel.findByIdAndDelete(id);
  }

  async getReservations(
    filter: ReservationSearchOptions,
  ): Promise<Array<Reservation>> {
    return this.reservationModel.find(filter);
  }
}
