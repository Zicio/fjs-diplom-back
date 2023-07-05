import { ID } from '../globalType';

export interface ISupportRequest {
  id: ID;
  createdAt: string;
  isActive: boolean;
  hasNewMessages: boolean;
  client?: IClient;
}

export interface IQueryGetSupportRequestsParams {
  limit?: number;
  offset?: number;
  isActive: boolean;
}

export interface IMessage {
  id: ID;
  createdAt: string;
  text: string;
  readAt: string | null;
  author: IAuthor;
}

interface IAuthor {
  id: ID;
  name: string;
}

export interface IClient {
  id: ID;
  name: string;
  email: string;
  contactPhone: string;
}

export interface IMarkMessageAsReadResponse {
  success: boolean;
}
