import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import {
  SupportRequest,
  SupportRequestDocument,
} from './schemas/support-request.schema';
import { Message, MessageDocument } from './schemas/message.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from '../users/schemas/user.schema';

interface ISendMessageDto {
  author: Types.ObjectId;
  supportRequest: Types.ObjectId;
  text: string;
}

interface IGetChatListParams {
  user: Types.ObjectId | null;
  isActive: boolean;
  limit?: number;
  offset?: number;
}

interface ISupportRequestService {
  getSupportRequestById(id: Types.ObjectId): Promise<SupportRequest | null>;

  findSupportRequests(params: IGetChatListParams): Promise<SupportRequest[]>;

  sendMessage(data: ISendMessageDto): Promise<Message>;

  getMessages(
    supportRequest: Types.ObjectId,
    user: UserDocument,
  ): Promise<Message[]>;

  subscribe(
    handler: (
      supportRequest: SupportRequest | null,
      message: Message | null,
    ) => void,
  ): () => void;
}

@Injectable()
export class SupportRequestsService implements ISupportRequestService {
  constructor(
    @InjectModel(SupportRequest.name)
    private supportRequestModel: Model<SupportRequestDocument>,
    @InjectModel(Message.name)
    private messageModel: Model<MessageDocument>,
  ) {}

  //  Метод добавлен для работы SupportRequestAccessGuard
  async getSupportRequestById(
    id: Types.ObjectId,
  ): Promise<SupportRequest | null> {
    return this.supportRequestModel.findById(id);
  }

  async findSupportRequests(params: IGetChatListParams) {
    const { user, isActive, limit, offset } = params;
    const query = this.supportRequestModel.find({ isActive });
    user && query.where('user').equals(user);
    return query.limit(limit ?? 0).skip(offset ?? 0);
  }

  async sendMessage(data: ISendMessageDto): Promise<Message> {
    const message = new this.messageModel(data);
    await message.save();
    await this.supportRequestModel.updateOne(
      { _id: data.supportRequest },
      { $push: { messages: message } },
    );
    return message;
  }

  async getMessages(supportRequest: Types.ObjectId): Promise<Message[]> {
    const supportRequestData = await this.getSupportRequestById(supportRequest);
    return (supportRequestData as SupportRequestDocument).messages;
  }

  subscribe(
    handler: (
      supportRequest: SupportRequest | null,
      message: Message | null,
    ) => void,
  ): () => void {
    const changeStream = this.supportRequestModel.watch();

    changeStream.on('change', async (change) => {
      if (change.operationType === 'update') {
        const { _id, messages } = change.updateDescription.updatedFields;
        const supportRequest = await this.supportRequestModel.findById(_id);
        const latestMessage = messages[messages.length - 1];

        if (latestMessage) {
          const message = await this.messageModel.findById(latestMessage);
          handler(supportRequest, message);
        }
      }
    });

    return () => changeStream.close();
  }
}