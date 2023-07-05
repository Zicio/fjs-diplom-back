import { Injectable } from '@nestjs/common';
import {
  SupportRequest,
  SupportRequestDocument,
} from './schemas/support-request.schema';
import { Message, MessageDocument } from './schemas/message.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ID } from '../globalType';

interface ISupportRequestClientService {
  createSupportRequest(user: ID): Promise<SupportRequest>;

  getUnreadCount(supportRequest: ID): Promise<Message[]>;
}

@Injectable()
export class SupportRequestsClientService
  implements ISupportRequestClientService
{
  constructor(
    @InjectModel(SupportRequest.name)
    private supportRequestModel: Model<SupportRequestDocument>,
    @InjectModel(Message.name)
    private messageModel: Model<MessageDocument>,
  ) {}

  async createSupportRequest(user: ID): Promise<SupportRequest> {
    const supportRequest = new this.supportRequestModel({ user });
    return supportRequest.save();
  }

  async getUnreadCount(supportRequest: ID): Promise<Message[]> {
    const supportRequestToReceipt = (await this.supportRequestModel
      .findById(supportRequest)
      .populate('messages')) as SupportRequestDocument & {
      messages: MessageDocument[];
    };
    if (!supportRequestToReceipt) {
      throw new Error('Support request not found');
    } else {
      const messages = supportRequestToReceipt.messages;
      return messages.filter((message: MessageDocument) => {
        return (
          !message.readAt && message.author !== supportRequestToReceipt.user
        );
      });
    }
  }
}
