import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
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
import { User, UserDocument } from '../users/schemas/user.schema';

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
  // dateEnd: Date;  Зачем нужны оба, если они не передаются с запросом по заданию?
}

interface IReservationService {
  addReservation(data: IReservationDto): Promise<Reservation>;

  removeReservation(id: ID, user: ID | null): Promise<void>;

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
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async addReservation(data: IReservationDto): Promise<Reservation> {
    const room = await this.hotelRoomModel.findById(data.room);
    if (!room || !room.isEnabled) {
      throw new BadRequestException(
        'Номер с указанным ID не существует/отключён',
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

  async removeReservation(id: ID, user: ID | null): Promise<void> {
    const reservation = await this.reservationModel.findById(id);
    if (!reservation) {
      throw new BadRequestException('Брони с указанным ID не существует');
    }
    if (user && reservation.user !== user) {
      throw new ForbiddenException('Нет прав доступа');
    }
    await this.reservationModel.deleteOne({ _id: reservation._id });
  }

  async getReservations(
    filter: IReservationSearchOptions,
  ): Promise<Array<Reservation>> {
    const user = await this.userModel.findById(filter.user);
    console.log({ user });
    if (!user) {
      throw new BadRequestException(
        'Пользователя с указанным ID не существует',
      );
    }
    const reservations = await this.reservationModel.find(filter).populate([
      { path: 'room', select: 'description images' },
      {
        path: 'hotel',
        select: 'title description',
      },
    ]);
    if (!reservations) {
      throw new InternalServerErrorException('Ошибка в получении броней');
    }
    return reservations;
  }
}
