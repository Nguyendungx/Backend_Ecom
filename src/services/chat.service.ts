import { ChatMessage, Conversation, IChatMessage, IConversation } from '../models/chat.model';
import User, { IUserDocument } from '../models/user.model';
import { ChatMessageRequest, ChatMessageResponse, ConversationResponse } from '../types/chat';
import mongoose from 'mongoose';

export class ChatService {
  // Send a message
  async sendMessage(senderId: string, messageData: ChatMessageRequest): Promise<ChatMessageResponse> {
    try {
      // Create the message
      const message = new ChatMessage({
        sender: senderId,
        receiver: messageData.receiver,
        content: messageData.content,
        messageType: messageData.messageType || 'text'
      });

      await message.save();

      // Get or create conversation
      const participants = [senderId, messageData.receiver].sort();
      let conversation = await Conversation.findOne({
        participants: { $all: participants, $size: participants.length }
      });

      if (!conversation) {
        conversation = new Conversation({
          participants,
          lastMessage: message._id as any,
          lastMessageAt: new Date(),
          unreadCount: { [messageData.receiver]: 1 }
        });
      } else {
        conversation.lastMessage = message._id as any;
        conversation.lastMessageAt = new Date();
        const currentCount = (conversation.unreadCount as any).get(messageData.receiver) || 0;
        (conversation.unreadCount as any).set(messageData.receiver, currentCount + 1);
      }

      await conversation.save();

      // Populate sender and receiver details
      const populatedMessage = await ChatMessage.findById(message._id)
        .populate('sender', 'name avatar')
        .populate('receiver', 'name avatar');

      return this.formatMessageResponse(populatedMessage!);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Get conversation messages
  async getConversationMessages(userId: string, otherUserId: string, limit: number = 50, offset: number = 0): Promise<ChatMessageResponse[]> {
    const participants = [userId, otherUserId].sort();
    
    const messages = await ChatMessage.find({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(offset)
    .populate('sender', 'name avatar')
    .populate('receiver', 'name avatar');

    return messages.map(message => this.formatMessageResponse(message));
  }

  // Get user conversations
  async getUserConversations(userId: string): Promise<ConversationResponse[]> {
    const conversations = await Conversation.find({
      participants: userId
    })
    .populate('participants', 'name avatar')
    .populate({
      path: 'lastMessage',
      populate: {
        path: 'sender receiver',
        select: 'name avatar'
      }
    })
    .sort({ lastMessageAt: -1 });

    return conversations.map(conversation => this.formatConversationResponse(conversation));
  }

  // Mark messages as read by conversation ID
  async markMessagesAsRead(userId: string, conversationId: string): Promise<void> {
    try {
      // Find the conversation first to validate it exists and user is a participant
      const conversation = await Conversation.findById(conversationId);
      
      if (!conversation) {
        throw new Error('Conversation not found');
      }

      // Check if user is a participant in this conversation
      if (!conversation.participants.some(p => p.toString() === userId)) {
        throw new Error('User is not a participant in this conversation');
      }

      // Mark all unread messages in this conversation as read for the user
      await ChatMessage.updateMany(
        {
          receiver: userId,
          isRead: false,
          $or: [
            { sender: { $in: conversation.participants.filter(p => p.toString() !== userId) } },
            { sender: { $in: conversation.participants } }
          ]
        },
        {
          isRead: true
        }
      );

      // Update conversation unread count for this user
      (conversation.unreadCount as any).set(userId, 0);
      await conversation.save();
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  }

  // Get unread message count
  async getUnreadCount(userId: string): Promise<{ [conversationId: string]: number }> {
    const conversations = await Conversation.find({
      participants: userId
    });

    const unreadCounts: { [conversationId: string]: number } = {};
    
    conversations.forEach(conversation => {
      const count = (conversation.unreadCount as any).get(userId) || 0;
      if (count > 0) {
        unreadCounts[(conversation._id as any).toString()] = count;
      }
    });

    return unreadCounts;
  }

  // Search conversations
  async searchConversations(userId: string, searchTerm: string): Promise<ConversationResponse[]> {
    const conversations = await Conversation.find({
      participants: userId
    })
    .populate('participants', 'name avatar')
    .populate({
      path: 'lastMessage',
      populate: {
        path: 'sender receiver',
        select: 'name avatar'
      }
    });

    // Filter conversations where participant name matches search term
    const filteredConversations = conversations.filter(conversation => {
      return conversation.participants.some((participant: any) => 
        (participant._id as any).toString() !== userId && 
        participant.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    return filteredConversations.map(conversation => this.formatConversationResponse(conversation));
  }

  // Delete message
  async deleteMessage(userId: string, messageId: string): Promise<boolean> {
    const message = await ChatMessage.findOne({
      _id: messageId,
      sender: userId
    });

    if (!message) {
      return false;
    }

    await message.deleteOne();
    return true;
  }

  // Format message response
  private formatMessageResponse(message: IChatMessage & { sender: any; receiver: any }): ChatMessageResponse {
    return {
      _id: (message._id as any).toString(),
      sender: {
        _id: message.sender._id.toString(),
        username: message.sender.name,
        avatar: message.sender.avatar
      },
      receiver: {
        _id: message.receiver._id.toString(),
        username: message.receiver.name,
        avatar: message.receiver.avatar
      },
      content: message.content,
      messageType: message.messageType,
      isRead: message.isRead,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt
    };
  }

  // Format conversation response
  private formatConversationResponse(conversation: IConversation & { participants: any[]; lastMessage?: any }): ConversationResponse {
    return {
      _id: (conversation._id as any).toString(),
      participants: conversation.participants.map((participant: any) => ({
        _id: participant._id.toString(),
        username: participant.name,
        avatar: participant.avatar
      })),
      lastMessage: conversation.lastMessage ? this.formatMessageResponse(conversation.lastMessage) : undefined,
      lastMessageAt: conversation.lastMessageAt,
      unreadCount: Object.fromEntries(conversation.unreadCount as any),
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt
    };
  }
} 