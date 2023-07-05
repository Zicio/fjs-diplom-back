import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { InjectModel } from '@nestjs/mongoose';
import {
  SupportRequest,
  SupportRequestDocument,
} from './schemas/support-request.schema';
import { ID } from '../globalType';

export interface ISupportRequestManagerService {
  getUnreadCount(supportRequest: ID): Promise<Message[]>;

  closeRequest(supportRequest: ID): Promise<SupportRequest | null>;
}

@Injectable()
export class SupportRequestsManagerService
  implements ISupportRequestManagerService
{
  constructor(
    @InjectModel(SupportRequest.name)
    private supportRequestModel: Model<SupportRequestDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

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
          !message.readAt && message.author === supportRequestToReceipt.user
        );
      });
    }
  }

  async closeRequest(supportRequest: ID): Promise<SupportRequest | null> {
    return this.supportRequestModel.findByIdAndUpdate(supportRequest, {
      isActive: false,
    });
  }
}
