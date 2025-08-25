const dotenv = require('dotenv');
dotenv.config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { Server: SocketIOServer } = require('socket.io');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/auth_routes');
const profileRoutes = require('./src/routes/profile_routes');
const adminRoutes = require('./src/routes/admin_routes');
const chatRoutes = require('./src/routes/chat_routes');
// const botRoutes = require('./src/routes/bot.routes'); // Keep commented as planned
const uploadRoutes = require('./src/routes/upload_routes');
const bulkRoutes = require('./src/routes/bulk_routes');
const errorHandler = require('./src/middleware/errorHandling');
const { registerChatHandlers } = require('./src/controllers/chat_controller');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || true,
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// DB Connection
(async () => {
  await connectDB();
})();

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/bulk', bulkRoutes);

// Error Handling
app.use(errorHandler);

// Server + Socket.IO
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: true, credentials: true }
});
app.set('io', io);

io.on('connection', (socket) => {
  registerChatHandlers(io, socket);
});

const PORT = process.env.PORT || 5050;
server.listen(PORT, () => console.log(`🚀 API running on :${PORT}`));