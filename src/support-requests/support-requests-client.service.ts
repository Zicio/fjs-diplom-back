import { Injectable } from '@nestjs/common';
import {
  SupportRequest,
  SupportRequestDocument,
} from './schemas/support-request.schema';
import { Message, MessageDocument } from './schemas/message.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IMarkMessagesAsReadDto } from './interfaces';

interface ISupportRequestClientService {
  //  в аргументах createSupportRequest убрал text, так как добавление сообщения производится через SupportRequestService.sendMessage
  createSupportRequest(user: Types.ObjectId): Promise<SupportRequest>;

  markMessagesAsRead(params: IMarkMessagesAsReadDto): Promise<void>;

  getUnreadCount(supportRequest: Types.ObjectId): Promise<Message[]>;
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

  async createSupportRequest(user: Types.ObjectId): Promise<SupportRequest> {
    const supportRequest = new this.supportRequestModel({ user });
    return supportRequest.save();
  }

  async markMessagesAsRead(params: IMarkMessagesAsReadDto): Promise<void> {
    try {
      const { user, supportRequest, createdBefore } = params;
      const supportRequestToUpdate = await this.supportRequestModel
        .findById(supportRequest)
        .populate('messages');

      if (!supportRequestToUpdate) {
        throw new Error('Support request not found');
      } else {
        const messages = supportRequestToUpdate.messages;
        const messagesToMark = messages.filter((message: MessageDocument) => {
          console.log(message.author !== user);
          console.log(!message.readAt);
          console.log(message.sentAt < createdBefore);
          return (
            message.author !== user &&
            !message.readAt &&
            message.sentAt < createdBefore
          );
        });

        console.log({ messagesToMark });

        const messageIdToMark: Types.ObjectId[] = messagesToMark.map(
          (message: MessageDocument) => {
            return message._id;
          },
        );
        console.log({ messageIdToMark });

        await this.messageModel.updateMany(
          { _id: { $in: messageIdToMark } },
          { readAt: new Date() },
        );

        await supportRequestToUpdate.save();
      }
    } catch (e) {
      console.log(e);
    }
  }

  async getUnreadCount(supportRequest: Types.ObjectId): Promise<Message[]> {
    const supportRequestToReceipt = await this.supportRequestModel.findById(
      supportRequest,
    );
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
