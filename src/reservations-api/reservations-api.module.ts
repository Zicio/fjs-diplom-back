import { Module } from '@nestjs/common';
import { ReservationsApiService } from './reservations-api.service';
import { ReservationsClientApiController } from './reservations-client-api.controller';
import { ReservationsManagerApiController } from './reservations-manager-api.controller';
import { ReservationsModule } from '../reservations/reservations.module';

@Module({
  imports: [ReservationsModule],
  controllers: [
    ReservationsClientApiController,
    ReservationsManagerApiController,
  ],
  providers: [ReservationsApiService],
})
export class ReservationsApiModule {}
