import { Module } from '@nestjs/common';
import { SupportRequestsClientApiController } from './support-requests-client-api.controller';
import { SupportRequestsCommonApiController } from './support-requests-common-api.controller';
import { SupportRequestsManagerApiController } from './support-requests-manager-api.controller';
import { SupportRequestsApiService } from './support-requests-api.service';
import { SupportRequestsModule } from '../support-requests/support-requests.module';
import { UsersModule } from '../users/users.module';
import { SupportRequestsApiGateway } from './support-requests-api.gateway';

@Module({
  imports: [SupportRequestsModule, UsersModule],
  controllers: [
    SupportRequestsClientApiController,
    SupportRequestsCommonApiController,
    SupportRequestsManagerApiController,
  ],
  providers: [SupportRequestsApiService, SupportRequestsApiGateway],
})
export class SupportRequestsApiModule {}
