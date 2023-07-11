import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { Reservation, ReservationDocument } from './schemas/reservation.schema';
import { InjectModel } from '@nestjs/mongoose';
import { ID } from '../globalType';
import {
  HotelRoom,
  HotelRoomDocument,
} from '../hotels/schemas/hotelRoom.schema';

interface IReservationDto {
  user: ID;
  hotel?: ID;
  room: ID;
  dateStart: Date;
  dateEnd: Date;
}

interface IReservationSearchOptions {
  user: ID;
  // dateStart: Date;
  // dateEnd: Date;  Зачем нужны оба??
}

interface IReservationService {
  addReservation(data: IReservationDto): Promise<Reservation>;

  removeReservation(id: ID, user: ID): Promise<void>;

  getReservations(
    filter: IReservationSearchOptions,
  ): Promise<Array<Reservation>>;
}

@Injectable()
export class ReservationsService implements IReservationService {
  constructor(
    @InjectModel(Reservation.name)
    private reservationModel: Model<ReservationDocument>,
    @InjectModel(HotelRoom.name)
    private hotelRoomModel: Model<HotelRoomDocument>,
  ) {}

  async addReservation(data: IReservationDto): Promise<Reservation> {
    const room = await this.hotelRoomModel.findById(data.room);
    if (!room || !room.isEnabled) {
      throw new BadRequestException(
        'Номер с указанным ID не существует или он отключён',
      );
    }
    data.hotel = room.hotel;
    const query = {
      room: data.room,
      $and: [
        { dateStart: { $lte: data.dateStart } },
        { dateEnd: { $gt: data.dateStart } },
      ],
    };
    const reservations = await this.reservationModel.find(query);
    if (reservations.length > 0) {
      throw new NotFoundException('Данный номер не доступен на заданную дату');
    }
    const newReservation = new this.reservationModel(data);
    await newReservation.save();
    const reservation = await this.reservationModel
      .findById(newReservation._id)
      .populate([
        { path: 'room', select: 'description images' },
        {
          path: 'hotel',
          select: 'title description',
        },
      ]);
    if (!reservation) {
      throw new Error('Бронь не создана');
    }
    return reservation;
  }

  async removeReservation(id: ID, user: ID): Promise<void> {
    const reservation = await this.reservationModel.findById(id);
    if (!reservation) {
      throw new BadRequestException('брони с указанным ID не существует');
    }
    if (reservation.user !== user) {
      throw new ForbiddenException('нет прав доступа');
    }
    await this.reservationModel.deleteOne({ _id: reservation._id });
  }

  async getReservations(
    filter: IReservationSearchOptions,
  ): Promise<Array<Reservation>> {
    const reservations = this.reservationModel.find(filter).populate([
      { path: 'room', select: 'description images' },
      {
        path: 'hotel',
        select: 'title description',
      },
    ]);
    if (!reservations) {
      throw new Error('Брони не найдены');
    }
    return reservations;
  }
}
