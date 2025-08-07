import { io, Socket } from 'socket.io-client';
import { ChatMessageRequest, ChatMessageResponse, ConversationResponse, SocketMessage, ChatNotification } from '../types/chat';

export class ClientChatService {
  private socket: Socket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private messageQueue: SocketMessage[] = [];
  private eventListeners: Map<string, Function[]> = new Map();

  constructor(private serverUrl: string, private authToken: string) {
    this.initializeSocket();
  }

  // Initialize Socket.IO connection
  private initializeSocket(): void {
    try {
      this.socket = io(this.serverUrl, {
        auth: {
          token: this.authToken
        },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay,
        timeout: 20000
      });

      this.setupSocketEventHandlers();
    } catch (error) {
      console.error('Failed to initialize socket:', error);
    }
  }

  // Setup socket event handlers
  private setupSocketEventHandlers(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to chat server');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.emit('connected');
      this.processMessageQueue();
    });

    this.socket.on('disconnect', (reason: string) => {
      console.log('Disconnected from chat server:', reason);
      this.isConnected = false;
      this.emit('disconnected', reason);
    });

    this.socket.on('connect_error', (error: Error) => {
      console.error('Socket connection error:', error);
      this.reconnectAttempts++;
      this.emit('connection_error', error);
    });

    this.socket.on('new_message', (data: any) => {
      this.emit('new_message', data);
    });

    this.socket.on('message_sent', (data: any) => {
      this.emit('message_sent', data);
    });

    this.socket.on('message_error', (data: any) => {
      this.emit('message_error', data);
    });

    this.socket.on('user_typing', (data: any) => {
      this.emit('user_typing', data);
    });

    this.socket.on('messages_read', (data: any) => {
      this.emit('messages_read', data);
    });

    this.socket.on('user_status', (data: any) => {
      this.emit('user_status', data);
    });

    this.socket.on('notification', (data: ChatNotification) => {
      this.emit('notification', data);
      this.showNotification(data);
    });
  }

  // Send message via Socket.IO
  public sendMessage(messageData: ChatMessageRequest): void {
    const socketMessage: SocketMessage = {
      type: 'message',
      data: {
        receiver: messageData.receiver,
        content: messageData.content
      }
    };

    if (this.isConnected && this.socket) {
      this.socket.emit('send_message', socketMessage);
    } else {
      // Queue message for later if offline
      this.messageQueue.push(socketMessage);
      this.storeOfflineMessage(messageData);
    }
  }

  // Send typing indicator
  public sendTypingIndicator(receiverId: string, isTyping: boolean): void {
    const socketMessage: SocketMessage = {
      type: 'typing',
      data: {
        receiver: receiverId,
        isTyping
      }
    };

    if (this.isConnected && this.socket) {
      this.socket.emit('typing', socketMessage);
    }
  }

  // Mark messages as read
  public markMessagesAsRead(senderId: string, conversationId?: string): void {
    const socketMessage: SocketMessage = {
      type: 'read',
      data: {
        sender: senderId,
        conversationId
      }
    };

    if (this.isConnected && this.socket) {
      this.socket.emit('mark_read', socketMessage);
    }
  }

  // Join conversation room
  public joinConversation(conversationId: string): void {
    if (this.isConnected && this.socket) {
      this.socket.emit('join_conversation', conversationId);
    }
  }

  // Leave conversation room
  public leaveConversation(conversationId: string): void {
    if (this.isConnected && this.socket) {
      this.socket.emit('leave_conversation', conversationId);
    }
  }

  // Process queued messages
  private processMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message && this.socket) {
        this.socket.emit('send_message', message);
      }
    }
  }

  // Store offline message
  private storeOfflineMessage(messageData: ChatMessageRequest): void {
    try {
      const offlineMessages = this.getOfflineMessages();
      offlineMessages.push({
        ...messageData,
        timestamp: Date.now(),
        id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      });
      localStorage.setItem('offline_messages', JSON.stringify(offlineMessages));
    } catch (error) {
      console.error('Failed to store offline message:', error);
    }
  }

  // Get offline messages
  public getOfflineMessages(): any[] {
    try {
      const stored = localStorage.getItem('offline_messages');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to get offline messages:', error);
      return [];
    }
  }

  // Clear offline messages
  public clearOfflineMessages(): void {
    try {
      localStorage.removeItem('offline_messages');
    } catch (error) {
      console.error('Failed to clear offline messages:', error);
    }
  }

  // Add event listener
  public on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  // Remove event listener
  public off(event: string, callback?: Function): void {
    if (!callback) {
      this.eventListeners.delete(event);
    } else {
      const listeners = this.eventListeners.get(event);
      if (listeners) {
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    }
  }

  // Emit event to listeners
  private emit(event: string, data?: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  // Show notification
  private showNotification(notification: ChatNotification): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      const options = {
        body: notification.data.content || 'New message received',
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: notification.data
      };

      new Notification('EcomStudy', options);
    }
  }

  // Check connection status
  public isSocketConnected(): boolean {
    return this.isConnected;
  }

  // Disconnect socket
  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Reconnect socket
  public reconnect(): void {
    this.disconnect();
    setTimeout(() => {
      this.initializeSocket();
    }, this.reconnectDelay);
  }

  // Get connection status
  public getConnectionStatus(): {
    connected: boolean;
    reconnectAttempts: number;
    queuedMessages: number;
  } {
    return {
      connected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      queuedMessages: this.messageQueue.length
    };
  }
}

// HTTP API service for chat
export class ChatAPIService {
  private baseURL: string;
  private authToken: string;

  constructor(baseURL: string, authToken: string) {
    this.baseURL = baseURL;
    this.authToken = authToken;
  }
  // Đánh dấu tất cả hội thoại chưa đọc thành đã đọc
  async markAllUnreadAsRead(): Promise<{ success: boolean; data: { updated: number }; error: string | null }> {
    try {
      const unread = await this.getUnreadCount();
      const conversationIds = Object.keys(unread).filter(id => unread[id] > 0);
      let updated = 0;
      for (const id of conversationIds) {
        const res = await this.markMessagesAsRead(id);
        if (res.success && res.data.isRead) updated++;
      }
      return {
        success: true,
        data: { updated },
        error: null
      };
    } catch (err: any) {
      return {
        success: false,
        data: { updated: 0 },
        error: err?.message || 'Error marking as read'
      };
    }
  }

  // Send message via HTTP API
  async sendMessage(messageData: ChatMessageRequest): Promise<ChatMessageResponse> {
    const response = await fetch(`${this.baseURL}/api/chat/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authToken}`
      },  
      body: JSON.stringify(messageData)
    });

    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  }

  // Get conversation messages
  async getConversationMessages(otherUserId: string, limit = 50, offset = 0): Promise<ChatMessageResponse[]> {
    const response = await fetch(
      `${this.baseURL}/api/chat/conversations/${otherUserId}/messages?limit=${limit}&offset=${offset}`,
      {
        headers: {
          'Authorization': `Bearer ${this.authToken}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get messages: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  }

  // Get user conversations
  async getUserConversations(): Promise<ConversationResponse[]> {
    const response = await fetch(`${this.baseURL}/api/chat/conversations`, {
      headers: {
        'Authorization': `Bearer ${this.authToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get conversations: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  }

  // Mark messages as read
  async markMessagesAsRead(senderId: string): Promise<{ success: boolean; data: { isRead: boolean }; error: string | null }> {
    const response = await fetch(`${this.baseURL}/api/chat/conversations/${senderId}/read`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.authToken}`
      }
    });

    const result = await response.json();
    console.log('Mark messages as read response:', result);

    if (!response.ok) {
      return {
        success: false,
        data: { isRead: false },
        error: result?.error || `Failed to mark messages as read: ${response.status}`
      };
    }

    return {
      success: true,
      data: { isRead: true },
      error: null
    };
  }

  // Get unread count
  async getUnreadCount(): Promise<{ [conversationId: string]: number }> {
    const response = await fetch(`${this.baseURL}/api/chat/unread-count`, {
      headers: {
        'Authorization': `Bearer ${this.authToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get unread count: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  }

  // Search conversations
  async searchConversations(query: string): Promise<ConversationResponse[]> {
    const response = await fetch(`${this.baseURL}/api/chat/conversations/search?q=${encodeURIComponent(query)}`, {
      headers: {
        'Authorization': `Bearer ${this.authToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to search conversations: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  }

  // Delete message
  async deleteMessage(messageId: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/api/chat/messages/${messageId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.authToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to delete message: ${response.status}`);
    }
  }
}