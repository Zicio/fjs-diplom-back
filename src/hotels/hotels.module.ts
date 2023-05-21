import { Module } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Hotel, HotelSchema } from './schemas/hotel.schema';
import { HotelsRoomsService } from './hotelsRooms.service';
import { HotelRoom, HotelRoomSchema } from './schemas/hotelRoom.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Hotel.name, schema: HotelSchema },
      { name: HotelRoom.name, schema: HotelRoomSchema },
    ]),
  ],
  providers: [HotelsService, HotelsRoomsService],
  exports: [HotelsService, HotelsRoomsService],
})
export class HotelsModule {}
