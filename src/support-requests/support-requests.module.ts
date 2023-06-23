import { Module } from '@nestjs/common';
import { SupportRequestsService } from './support-requests.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SupportRequest,
  SupportRequestSchema,
} from './schemas/support-request.schema';
import { Message, MessageSchema } from './schemas/message.schema';
import { SupportRequestsClientService } from './support-requests-client.service';
import { SupportRequestsManagerService } from './support-requests-manager.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SupportRequest.name, schema: SupportRequestSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
  ],
  providers: [
    SupportRequestsService,
    SupportRequestsClientService,
    SupportRequestsManagerService,
  ],
  exports: [
    SupportRequestsService,
    SupportRequestsClientService,
    SupportRequestsManagerService,
  ],
})
export class SupportRequestsModule {}
