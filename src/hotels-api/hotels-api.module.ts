import { Module } from '@nestjs/common';
import { HotelsModule } from '../hotels/hotels.module';
import { HotelsApiCommonService } from './common/hotels-api-common.service';
import { HotelsApiCommonController } from './hotels-api-common.controller';
import { HotelsApiAdminController } from './hotels-api-admin.controller';
import { HotelsApiAdminService } from './admin/hotels-api-admin.service';
import { HotelsApiService } from './hotels-api.service';

@Module({
  imports: [HotelsModule],
  controllers: [HotelsApiAdminController, HotelsApiCommonController],
  providers: [HotelsApiAdminService, HotelsApiCommonService, HotelsApiService],
})
export class HotelsApiModule {}
