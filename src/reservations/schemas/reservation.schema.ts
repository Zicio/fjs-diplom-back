import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../users/schemas/user.schema';
import { Hotel } from '../../hotels/schemas/hotel.schema';
import { HotelRoom } from '../../hotels/schemas/hotelRoom.schema';
import { Document, Types } from 'mongoose';

export type ReservationDocument = Reservation & Document;

@Schema({ versionKey: false })
export class Reservation {
  @Prop({ ref: User.name, required: true })
  user: Types.ObjectId;

  @Prop({ ref: Hotel.name, required: true })
  hotel: Types.ObjectId;

  @Prop({ ref: HotelRoom.name, required: true })
  room: Types.ObjectId;

  @Prop({ required: true })
  dateStart: Date;

  @Prop({ required: true })
  dateEnd: Date;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
