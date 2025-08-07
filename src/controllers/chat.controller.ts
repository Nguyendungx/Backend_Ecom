import { Request, Response } from 'express';
import { ChatService } from '../services/chat.service';
import { ChatMessageRequest } from '../types/chat';

const chatService = new ChatService();

export class ChatController {
  // Send a message
  async sendMessage(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const messageData: ChatMessageRequest = req.body;

      if (!messageData.receiver || !messageData.content) {
        return res.status(400).json({
          success: false,
          message: 'Receiver and content are required'
        });
      }

      const message = await chatService.sendMessage(userId, messageData);

      res.status(201).json({
        success: true,
        data: message,
        message: 'Message sent successfully'
      });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send message'
      });
    }
  }

  // Get conversation messages
  async getConversationMessages(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { otherUserId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      if (!otherUserId) {
        return res.status(400).json({
          success: false,
          message: 'Other user ID is required'
        });
      }

      const messages = await chatService.getConversationMessages(userId, otherUserId, limit, offset);

      res.status(200).json({
        success: true,
        data: messages,
        message: 'Messages retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting conversation messages:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get conversation messages'
      });
    }
  }

  // Get user conversations
  async getUserConversations(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;

      const conversations = await chatService.getUserConversations(userId);

      res.status(200).json({
        success: true,
        data: conversations,
        message: 'Conversations retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting user conversations:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get user conversations'
      });
    }
  }

  // Mark messages as read by conversation ID
  async markMessagesAsRead(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { conversationId } = req.params;

      if (!conversationId) {
        return res.status(400).json({
          success: false,
          data: null,
          error: 'Conversation ID is required'
        });
      }

      await chatService.markMessagesAsRead(userId, conversationId);

      res.status(200).json({
        success: true,
        data: { message: 'Messages marked as read successfully' },
        error: null
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
      res.status(500).json({
        success: false,
        data: null,
        error: 'Failed to mark messages as read'
      });
    }
  }

  // Get unread count
  async getUnreadCount(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;

      const unreadCounts = await chatService.getUnreadCount(userId);

      res.status(200).json({
        success: true,
        data: unreadCounts,
        message: 'Unread counts retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting unread count:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get unread count'
      });
    }
  }

  // Search conversations
  async searchConversations(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { q } = req.query;

      if (!q || typeof q !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      const conversations = await chatService.searchConversations(userId, q);

      res.status(200).json({
        success: true,
        data: conversations,
        message: 'Search results retrieved successfully'
      });
    } catch (error) {
      console.error('Error searching conversations:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to search conversations'
      });
    }
  }

  // Delete message
  async deleteMessage(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { messageId } = req.params;

      if (!messageId) {
        return res.status(400).json({
          success: false,
          message: 'Message ID is required'
        });
      }

      const deleted = await chatService.deleteMessage(userId, messageId);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Message not found or you are not authorized to delete it'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Message deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete message'
      });
    }
  }
} 