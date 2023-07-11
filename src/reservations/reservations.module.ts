import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Reservation, ReservationSchema } from './schemas/reservation.schema';
import { HotelRoom, HotelRoomSchema } from '../hotels/schemas/hotelRoom.schema';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reservation.name, schema: ReservationSchema },
      { name: HotelRoom.name, schema: HotelRoomSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [ReservationsService],
  exports: [ReservationsService],
})
export class ReservationsModule {}
