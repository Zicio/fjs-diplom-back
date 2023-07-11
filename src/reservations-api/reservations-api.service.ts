import { Injectable } from '@nestjs/common';
import { ReservationsService } from '../reservations/reservations.service';
import { AddReservationDto } from './dto/addReservation.dto';
import { ReservationDocument } from '../reservations/schemas/reservation.schema';
import { ReservationResponseDto } from './dto/reservation-response.dto';
import { GetReservationsDto } from './dto/getReservations.dto';
import { DeleteReservationDto } from './dto/deleteReservation.dto';

@Injectable()
export class ReservationsApiService {
  constructor(private readonly reservationsService: ReservationsService) {}

  //  2.2.1. Бронирование номера клиентом
  async addReservation(
    addReservationDto: AddReservationDto,
  ): Promise<ReservationResponseDto> {
    try {
      const { user, room, startDate, endDate } = addReservationDto;
      const dateStart = new Date(startDate);
      const dateEnd = new Date(endDate);
      const reservation = (await this.reservationsService.addReservation({
        user,
        room,
        dateStart,
        dateEnd,
      })) as ReservationDocument & {
        room: { description: string; images: string[] };
        hotel: { title: string; description: string };
      };
      return {
        startDate: reservation.dateStart.toISOString(),
        endDate: reservation.dateEnd.toISOString(),
        hotelRoom: {
          description: reservation.room.description,
          images: reservation.room.images,
        },
        hotel: {
          title: reservation.hotel.title,
          description: reservation.hotel.description,
        },
      };
    } catch (e) {
      throw e;
    }
  }

  //  2.2.2. Список броней текущего пользователя
  async getReservations(
    getReservationsDto: GetReservationsDto,
  ): Promise<ReservationResponseDto[]> {
    try {
      const reservations = (await this.reservationsService.getReservations(
        getReservationsDto,
      )) as ReservationDocument[] & {
        room: { description: string; images: string[] };
        hotel: { title: string; description: string };
      };
      return reservations.map((reservation) => {
        const { dateStart, dateEnd, room, hotel } =
          reservation as ReservationDocument & {
            room: { description: string; images: string[] };
            hotel: { title: string; description: string };
          };
        return {
          startDate: dateStart.toISOString(),
          endDate: dateEnd.toISOString(),
          hotelRoom: {
            description: room.description,
            images: room.images,
          },
          hotel: {
            title: hotel.title,
            description: hotel.description,
          },
        };
      });
    } catch (e) {
      throw e;
    }
  }

  //  2.2.3. Отмена бронирования клиентом
  async deleteReservation(
    deleteReservationDto: DeleteReservationDto,
  ): Promise<void> {
    try {
      const { id, user } = deleteReservationDto;
      await this.reservationsService.removeReservation(id, user);
      return;
    } catch (e) {
      throw e;
    }
  }
}
