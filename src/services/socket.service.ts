import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';
import { ChatService } from './chat.service';
import { SocketMessage, ChatNotification } from '../types/chat';
import { User } from '../models/user.model';

interface AuthenticatedSocket {
  userId: string;
  username: string;
  socketId: string;
}

export class SocketService {
  private io: SocketIOServer;
  private chatService: ChatService;
  private connectedUsers: Map<string, AuthenticatedSocket> = new Map();

  constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });
    this.chatService = new ChatService();
    this.setupSocketHandlers();
  }

  private setupSocketHandlers() {
    // Authentication middleware
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
          return next(new Error('Authentication token required'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
        const user = await User.findById(decoded.id).select('username avatar');
        
        if (!user) {
          return next(new Error('User not found'));
        }

        socket.data.user = {
          id: user._id.toString(),
          username: user.username,
          avatar: user.avatar
        };
        
        next();
      } catch (error) {
        next(new Error('Invalid token'));
      }
    });

    // Connection handler
    this.io.on('connection', (socket) => {
      const user = socket.data.user;
      console.log(`User ${user.username} connected: ${socket.id}`);

      // Store connected user
      this.connectedUsers.set(user.id, {
        userId: user.id,
        username: user.username,
        socketId: socket.id
      });

      // Join user to their personal room
      socket.join(`user:${user.id}`);

      // Broadcast user online status
      this.broadcastUserStatus(user.id, user.username, true);

      // Handle private messages
      socket.on('send_message', async (data: SocketMessage) => {
        try {
          if (data.type !== 'message' || !data.data.receiver || !data.data.content) {
            return;
          }

          const message = await this.chatService.sendMessage(user.id, {
            receiver: data.data.receiver,
            content: data.data.content,
            messageType: data.data.messageType as any || 'text'
          });

          // Send to sender
          socket.emit('message_sent', {
            success: true,
            data: message
          });

          // Send to receiver if online
          const receiverSocket = this.connectedUsers.get(data.data.receiver);
          if (receiverSocket) {
            this.io.to(receiverSocket.socketId).emit('new_message', {
              type: 'new_message',
              data: {
                sender: user.id,
                receiver: data.data.receiver,
                messageId: message._id,
                content: message.content,
                conversationId: message._id // You might want to get the actual conversation ID
              }
            });
          }

          // Send notification to receiver
          this.sendNotification(data.data.receiver, {
            type: 'new_message',
            data: {
              sender: user.id,
              receiver: data.data.receiver,
              messageId: message._id,
              content: message.content,
              username: user.username
            }
          });

        } catch (error) {
          console.error('Error sending message via socket:', error);
          socket.emit('message_error', {
            success: false,
            message: 'Failed to send message'
          });
        }
      });

      // Handle typing indicators
      socket.on('typing', (data: SocketMessage) => {
        if (data.type === 'typing' && data.data.receiver) {
          const receiverSocket = this.connectedUsers.get(data.data.receiver);
          if (receiverSocket) {
            this.io.to(receiverSocket.socketId).emit('user_typing', {
              type: 'typing',
              data: {
                sender: user.id,
                receiver: data.data.receiver,
                isTyping: data.data.isTyping
              }
            });
          }
        }
      });

      // Handle read receipts
      socket.on('mark_read', async (data: SocketMessage) => {
        try {
          if (data.type === 'read' && data.data.sender) {
            await this.chatService.markMessagesAsRead(user.id, data.data.sender);

            // Notify sender that messages were read
            const senderSocket = this.connectedUsers.get(data.data.sender);
            if (senderSocket) {
              this.io.to(senderSocket.socketId).emit('messages_read', {
                type: 'read',
                data: {
                  sender: data.data.sender,
                  receiver: user.id,
                  conversationId: data.data.conversationId
                }
              });
            }
          }
        } catch (error) {
          console.error('Error marking messages as read:', error);
        }
      });

      // Handle join conversation
      socket.on('join_conversation', (conversationId: string) => {
        socket.join(`conversation:${conversationId}`);
        console.log(`User ${user.username} joined conversation: ${conversationId}`);
      });

      // Handle leave conversation
      socket.on('leave_conversation', (conversationId: string) => {
        socket.leave(`conversation:${conversationId}`);
        console.log(`User ${user.username} left conversation: ${conversationId}`);
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        console.log(`User ${user.username} disconnected: ${socket.id}`);
        
        // Remove from connected users
        this.connectedUsers.delete(user.id);
        
        // Broadcast user offline status
        this.broadcastUserStatus(user.id, user.username, false);
      });
    });
  }

  // Broadcast user online/offline status
  private broadcastUserStatus(userId: string, username: string, isOnline: boolean) {
    this.io.emit('user_status', {
      type: isOnline ? 'online' : 'offline',
      data: {
        userId,
        username,
        isOnline
      }
    });
  }

  // Send notification to specific user
  private sendNotification(userId: string, notification: ChatNotification) {
    const userSocket = this.connectedUsers.get(userId);
    if (userSocket) {
      this.io.to(userSocket.socketId).emit('notification', notification);
    }
  }

  // Get connected users
  public getConnectedUsers(): AuthenticatedSocket[] {
    return Array.from(this.connectedUsers.values());
  }

  // Check if user is online
  public isUserOnline(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }

  // Send message to specific user
  public sendToUser(userId: string, event: string, data: any) {
    const userSocket = this.connectedUsers.get(userId);
    if (userSocket) {
      this.io.to(userSocket.socketId).emit(event, data);
    }
  }

  // Send message to all users
  public broadcastToAll(event: string, data: any) {
    this.io.emit(event, data);
  }

  // Send message to conversation room
  public sendToConversation(conversationId: string, event: string, data: any) {
    this.io.to(`conversation:${conversationId}`).emit(event, data);
  }

  // Get IO instance
  public getIO(): SocketIOServer {
    return this.io;
  }
} 