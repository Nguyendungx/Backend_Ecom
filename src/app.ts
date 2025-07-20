// Nếu gặp lỗi linter: Cannot find module 'express', hãy chạy: npm install express @types/express
import express from 'express';
import courseRoute from './routes/course.route';
import materialRoute from './routes/material.route';
import eventRoute from './routes/event.route';
import postRoute from './routes/post.route';
import userRoute from './routes/user.route';
import cartRoute from './routes/cart.route';
import noteRoute from './routes/note.route';
import commentRoute from './routes/comment.route';
import historyRoute from './routes/history.route';
import favoriteRoute from './routes/favorite.route';
import authRoute from './routes/auth.route';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ecom Study API',
      version: '1.0.0',
      description: 'API documentation for Ecom Study backend',
    },
    servers: [
      { url: 'http://localhost:3000' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      { bearerAuth: [] }
    ],
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const app = express();

app.use(express.json());
app.use('/api/courses', courseRoute);
app.use('/api/materials', materialRoute);
app.use('/api/events', eventRoute);
app.use('/api/posts', postRoute);
app.use('/api/users', userRoute);
app.use('/api/carts', cartRoute);
app.use('/api/notes', noteRoute);
app.use('/api/comments', commentRoute);
app.use('/api/histories', historyRoute);
app.use('/api/favorites', favoriteRoute);
app.use('/api/auth', authRoute);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
