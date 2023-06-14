import { Module } from '@nestjs/common';
import { HotelsModule } from '../hotels/hotels.module';
import { HotelsApiCommonController } from './hotels-api-common.controller';
import { HotelsApiAdminController } from './hotels-api-admin.controller';

import { HotelsApiService } from './hotels-api.service';

@Module({
  imports: [HotelsModule],
  controllers: [HotelsApiAdminController, HotelsApiCommonController],
  providers: [HotelsApiService],
})
export class HotelsApiModule {}
