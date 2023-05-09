import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import {
  SupportRequest,
  SupportRequestDocument,
} from './schemas/support-request.schema';
import { Message, MessageDocument } from './schemas/message.schema';
import { InjectModel } from '@nestjs/mongoose';

interface SendMessageDto {
  author: Types.ObjectId;
  supportRequest: Types.ObjectId;
  text: string;
}

interface GetChatListParams {
  user: Types.ObjectId | null;
  isActive: boolean;
}

interface ISupportRequestService {
  findSupportRequests(params: GetChatListParams): Promise<SupportRequest[]>;

  sendMessage(data: SendMessageDto): Promise<Message>;

  getMessages(supportRequest: Types.ObjectId): Promise<Message[]>;

  subscribe(
    handler: (
      supportRequest: SupportRequest | null,
      message: Message | null,
    ) => void,
  ): () => void;
}

@Injectable()
export class SupportRequestService implements ISupportRequestService {
  constructor(
    @InjectModel(SupportRequest.name)
    private supportRequestModel: Model<SupportRequestDocument>,
    @InjectModel(Message.name)
    private messageModel: Model<MessageDocument>,
  ) {}

  async findSupportRequests(
    params: GetChatListParams,
  ): Promise<SupportRequest[]> {
    return this.supportRequestModel.find({ params });
  }

  async sendMessage(data: SendMessageDto): Promise<Message> {
    const message = new this.messageModel(data);
    await message.save();
    this.supportRequestModel.updateOne(
      { _id: data.supportRequest },
      { $push: { messages: message } },
    );
    return message;
  }

  async getMessages(supportRequest: Types.ObjectId): Promise<Message[]> {
    return this.messageModel.find({ supportRequest });
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
