import { Module } from '@nestjs/common';
import { SupportRequestService } from './support-request.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SupportRequest,
  SupportRequestSchema,
} from './schemas/support-request.schema';
import { Message, MessageSchema } from './schemas/message.schema';
import { SupportRequestClientService } from './support-request-client.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SupportRequest.name, schema: SupportRequestSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
  ],
  providers: [SupportRequestService, SupportRequestClientService],
  exports: [SupportRequestService, SupportRequestClientService],
})
export class SupportRequestModule {}
