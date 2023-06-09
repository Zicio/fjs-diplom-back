import { Module } from '@nestjs/common';
import { HotelsModule } from '../hotels/hotels.module';
import { HotelsApiCommonService } from './common/hotels-api-common.service';
import { HotelsApiCommonController } from './common/hotels-api-common.controller';
import { HotelsApiAdminController } from './admin/hotels-api-admin.controller';
import { HotelsApiAdminService } from './admin/hotels-api-admin.service';

@Module({
  imports: [HotelsModule],
  controllers: [HotelsApiAdminController, HotelsApiCommonController],
  providers: [HotelsApiAdminService, HotelsApiCommonService],
})
export class HotelsApiModule {}
