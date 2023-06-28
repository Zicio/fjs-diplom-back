import { Injectable } from '@nestjs/common';
import { ReservationsService } from '../reservations/reservations.service';

@Injectable()
export class ReservationsApiService {
  constructor(private readonly reservationsService: ReservationsService) {}

  //  2.2.1. Бронирование номера клиентом
  // async addReservation(createReservationDto: CreateReservationDto) {
  //   try {
  //
  //   }
  // }
}
