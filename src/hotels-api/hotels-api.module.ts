import { Module } from '@nestjs/common';
import { HotelsApiController } from './hotels-api.controller';
import { HotelsApiService } from './hotels-api.service';
import { HotelsModule } from '../hotels/hotels.module';

@Module({
  imports: [HotelsModule],
  controllers: [HotelsApiController],
  providers: [HotelsApiService],
})
export class HotelsApiModule {}
