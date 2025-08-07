import { IChatMessage, IConversation } from '../models/chat.model';

export interface ChatMessageRequest {
  receiver: string;
  content: string;
  messageType?: 'text' | 'image' | 'file';
}

export interface ChatMessageResponse {
  _id: string;
  sender: {
    _id: string;
    username: string;
    avatar?: string;
  };
  receiver: {
    _id: string;
    username: string;
    avatar?: string;
  };
  content: string;
  messageType: 'text' | 'image' | 'file';
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationResponse {
  _id: string;
  participants: Array<{
    _id: string;
    username: string;
    avatar?: string;
  }>;
  lastMessage?: ChatMessageResponse;
  lastMessageAt?: Date;
  unreadCount: { [userId: string]: number };
  createdAt: Date;
  updatedAt: Date;
}

export interface SocketMessage {
  type: 'message' | 'typing' | 'read' | 'online' | 'offline';
  data: {
    sender?: string;
    receiver?: string;
    content?: string;
    messageId?: string;
    conversationId?: string;
    isTyping?: boolean;
    isOnline?: boolean;
  };
}

export interface ChatNotification {
  type: 'new_message' | 'message_read' | 'user_online' | 'user_offline';
  data: {
    sender?: string;
    receiver?: string;
    messageId?: string;
    conversationId?: string;
    content?: string;
    userId?: string;
    username?: string;
  };
}

export interface OfflineRequest {
  id: string;
  method: 'POST' | 'PUT' | 'DELETE';
  url: string;
  data?: any;
  headers?: Record<string, string>;
  timestamp: number;
  retryCount: number;
}

export interface WorkboxConfig {
  cacheName: string;
  maxEntries: number;
  maxAgeSeconds: number;
  strategies: {
    api: 'networkFirst' | 'cacheFirst' | 'staleWhileRevalidate';
    assets: 'cacheFirst' | 'networkFirst';
  };
} 