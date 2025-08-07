# Chat System với Socket.IO và Workbox Offline Support

## Tổng quan

Hệ thống chat này được tích hợp với Socket.IO cho real-time messaging và Workbox cho offline functionality. Hệ thống tự động lưu trữ các request khi offline và retry khi online mà không cần can thiệp thủ công.

## Tính năng

### Chat System
- ✅ Real-time messaging với Socket.IO
- ✅ Typing indicators
- ✅ Read receipts
- ✅ Online/offline status
- ✅ Push notifications
- ✅ Message history
- ✅ Conversation management
- ✅ Message search
- ✅ File/image sharing support

### Offline Support
- ✅ Automatic request queuing khi offline
- ✅ Background sync khi online
- ✅ Cache strategies cho API và assets
- ✅ Service Worker với Workbox
- ✅ IndexedDB storage cho offline data
- ✅ Automatic retry mechanism

## Cài đặt

### 1. Cài đặt dependencies

```bash
npm install socket.io workbox-webpack-plugin workbox-window
npm install --save-dev @types/socket.io
```

### 2. Cấu hình Environment Variables

Tạo file `.env`:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/ecomstudy
JWT_SECRET=your-secret-key
CLIENT_URL=http://localhost:3000
```

### 3. Khởi động server

```bash
npm run dev
```

## API Endpoints

### Chat Endpoints

#### Gửi tin nhắn
```http
POST /api/chat/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "receiver": "user_id",
  "content": "Hello!",
  "messageType": "text"
}
```

#### Lấy danh sách conversations
```http
GET /api/chat/conversations
Authorization: Bearer <token>
```

#### Lấy tin nhắn của conversation
```http
GET /api/chat/conversations/{otherUserId}/messages?limit=50&offset=0
Authorization: Bearer <token>
```

#### Đánh dấu tin nhắn đã đọc
```http
PUT /api/chat/conversations/{senderId}/read
Authorization: Bearer <token>
```

#### Lấy số tin nhắn chưa đọc
```http
GET /api/chat/unread-count
Authorization: Bearer <token>
```

#### Tìm kiếm conversations
```http
GET /api/chat/conversations/search?q=search_term
Authorization: Bearer <token>
```

#### Xóa tin nhắn
```http
DELETE /api/chat/messages/{messageId}
Authorization: Bearer <token>
```

## Socket.IO Events

### Client Events

#### Gửi tin nhắn
```javascript
socket.emit('send_message', {
  type: 'message',
  data: {
    receiver: 'user_id',
    content: 'Hello!',
    messageType: 'text'
  }
});
```

#### Typing indicator
```javascript
socket.emit('typing', {
  type: 'typing',
  data: {
    receiver: 'user_id',
    isTyping: true
  }
});
```

#### Mark as read
```javascript
socket.emit('mark_read', {
  type: 'read',
  data: {
    sender: 'user_id',
    conversationId: 'conversation_id'
  }
});
```

#### Join conversation
```javascript
socket.emit('join_conversation', 'conversation_id');
```

### Server Events

#### New message
```javascript
socket.on('new_message', (data) => {
  console.log('New message received:', data);
});
```

#### Message sent confirmation
```javascript
socket.on('message_sent', (data) => {
  console.log('Message sent successfully:', data);
});
```

#### User typing
```javascript
socket.on('user_typing', (data) => {
  console.log('User is typing:', data);
});
```

#### Messages read
```javascript
socket.on('messages_read', (data) => {
  console.log('Messages marked as read:', data);
});
```

#### User status
```javascript
socket.on('user_status', (data) => {
  console.log('User status changed:', data);
});
```

## Client-side Usage

### Khởi tạo Chat Service

```typescript
import { ClientChatService, ChatAPIService } from './services/client-chat.service';

// Socket.IO service
const chatService = new ClientChatService('http://localhost:3000', authToken);

// HTTP API service
const chatAPI = new ChatAPIService('http://localhost:3000', authToken);
```

### Sử dụng Chat Service

```typescript
// Gửi tin nhắn
chatService.sendMessage({
  receiver: 'user_id',
  content: 'Hello!',
  messageType: 'text'
});

// Lắng nghe tin nhắn mới
chatService.on('new_message', (data) => {
  console.log('New message:', data);
});

// Lắng nghe connection status
chatService.on('connected', () => {
  console.log('Connected to chat server');
});

chatService.on('disconnected', (reason) => {
  console.log('Disconnected:', reason);
});

// Gửi typing indicator
chatService.sendTypingIndicator('user_id', true);

// Mark messages as read
chatService.markMessagesAsRead('sender_id');

// Join conversation
chatService.joinConversation('conversation_id');
```

### Sử dụng HTTP API

```typescript
// Gửi tin nhắn qua HTTP
const message = await chatAPI.sendMessage({
  receiver: 'user_id',
  content: 'Hello!',
  messageType: 'text'
});

// Lấy conversations
const conversations = await chatAPI.getUserConversations();

// Lấy tin nhắn
const messages = await chatAPI.getConversationMessages('other_user_id');

// Mark as read
await chatAPI.markMessagesAsRead('sender_id');

// Get unread count
const unreadCounts = await chatAPI.getUnreadCount();

// Search conversations
const searchResults = await chatAPI.searchConversations('search_term');
```

## Offline Functionality

### Service Worker

Service Worker được cấu hình với Workbox để:

- Cache API requests với Network First strategy
- Cache static assets với Cache First strategy
- Cache images với Stale While Revalidate strategy
- Background sync cho offline requests
- Automatic retry khi online

### Offline Request Handling

```typescript
// Workbox tự động queue requests khi offline
const response = await fetch('/api/chat/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(messageData)
});

// Request sẽ được queue và retry khi online
```

### Offline Message Storage

```typescript
// Lấy offline messages
const offlineMessages = chatService.getOfflineMessages();

// Clear offline messages
chatService.clearOfflineMessages();
```

## Database Schema

### ChatMessage Collection

```javascript
{
  _id: ObjectId,
  sender: ObjectId, // Reference to User
  receiver: ObjectId, // Reference to User
  content: String,
  messageType: String, // 'text', 'image', 'file'
  isRead: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Conversation Collection

```javascript
{
  _id: ObjectId,
  participants: [ObjectId], // Array of User IDs
  lastMessage: ObjectId, // Reference to ChatMessage
  lastMessageAt: Date,
  unreadCount: Map, // userId -> count
  createdAt: Date,
  updatedAt: Date
}
```

## Cấu hình Workbox

### Cache Strategies

```javascript
// API requests - Network First
{
  strategy: 'networkFirst',
  options: {
    cacheName: 'api-cache',
    networkTimeoutSeconds: 3,
    cacheableResponse: { statuses: [0, 200] }
  }
}

// Static assets - Cache First
{
  strategy: 'cacheFirst',
  options: {
    cacheName: 'static-cache',
    cacheableResponse: { statuses: [0, 200] }
  }
}

// Images - Stale While Revalidate
{
  strategy: 'staleWhileRevalidate',
  options: {
    cacheName: 'images-cache',
    cacheableResponse: { statuses: [0, 200] }
  }
}
```

### Background Sync

```javascript
// Background sync configuration
{
  queueName: 'offline-requests',
  maxRetentionTime: 24 * 60 // 24 hours
}
```

## Testing

### Test Socket.IO Connection

```javascript
// Test connection
const socket = io('http://localhost:3000', {
  auth: { token: 'your-auth-token' }
});

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', (reason) => {
  console.log('Disconnected:', reason);
});
```

### Test Offline Functionality

1. Disconnect internet
2. Send message via API
3. Check IndexedDB for queued request
4. Reconnect internet
5. Check if request is automatically retried

## Deployment

### Production Configuration

```javascript
// Update CORS settings
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"]
  }
});

// Update service worker cache names
const cacheNames = {
  api: 'api-cache-prod',
  static: 'static-cache-prod',
  images: 'images-cache-prod'
};
```

### Environment Variables

```env
NODE_ENV=production
PORT=3000
MONGO_URI=mongodb://your-production-db
JWT_SECRET=your-production-secret
CLIENT_URL=https://your-domain.com
```

## Troubleshooting

### Common Issues

1. **Socket connection fails**
   - Check CORS configuration
   - Verify auth token
   - Check network connectivity

2. **Offline requests not syncing**
   - Check service worker registration
   - Verify IndexedDB permissions
   - Check background sync support

3. **Messages not delivered**
   - Check user online status
   - Verify conversation participants
   - Check database connections

### Debug Mode

```javascript
// Enable debug logging
workbox.setConfig({ debug: true });

// Check connection status
const status = chatService.getConnectionStatus();
console.log('Connection status:', status);
```

## Performance Optimization

### Caching Strategies

- API responses cached for 5 minutes
- Static assets cached for 30 days
- Images cached with stale-while-revalidate
- Background sync with 24-hour retention

### Database Indexes

```javascript
// Optimize queries
chatMessageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });
chatMessageSchema.index({ receiver: 1, sender: 1, createdAt: -1 });
```

### Memory Management

- Automatic cleanup of old cache entries
- Limited offline request queue size
- Efficient IndexedDB usage

## Security Considerations

- JWT authentication for all endpoints
- Socket.IO authentication middleware
- Input validation and sanitization
- Rate limiting for API endpoints
- Secure WebSocket connections

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Add tests
5. Submit pull request

## License

MIT License 