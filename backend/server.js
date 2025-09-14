import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";

// Route imports
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import interestRoutes from "./routes/interestRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// Middleware imports
import { authenticateUser } from "./middlewares/authMiddleware.js";

dotenv.config();

// Make sure we have a JWT_SECRET
if (!process.env.JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ JWT_SECRET environment variable is required in production');
    process.exit(1);
  } else {
    console.warn("⚠️ No JWT_SECRET in environment, using fallback secret. This is not secure for production!");
    process.env.JWT_SECRET = "mumbai_swap_dev_secret_key_2024";
  }
}

// Define frontend URL - must be specific when using credentials
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// Allow all origins for CORS
const allowedOrigins = [
  FRONTEND_URL,
  "https://swap-sewa.vercel.app",
  "https://mumbai-swap.vercel.app"
];

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: true, // Allow all origins
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(cors({
  origin: true, // Allow all origins
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Add preflight OPTIONS handling for all routes
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With");
  res.sendStatus(200);
});

// Make io accessible to routes
app.set('io', io);

// Add detailed debugging
console.log('Starting server...');
console.log('Environment:', process.env.NODE_ENV || 'development');

// Check MongoDB connection status
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Database connection
if (!process.env.MONGODB_URI) {
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ MONGODB_URI environment variable is required in production');
    process.exit(1);
  } else {
    // Provide a safe local development fallback (adjust DB name if desired)
    const fallback = 'mongodb://127.0.0.1:27017/swapsewa_dev';
    console.warn(`⚠️  No MONGODB_URI provided. Using local fallback: ${fallback}`);
    process.env.MONGODB_URI = fallback;
  }
}

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((error) => console.error("❌ MongoDB connection error:", error));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/interests", interestRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/admin", adminRoutes);

// Health check endpoint for Railway
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

// Socket.io middleware for authentication
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error("Authentication error"));
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    
    next();
  } catch (error) {
    console.error("Socket authentication error:", error);
    next(new Error("Authentication error"));
  }
});

// Handle user connections
io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.userId);
  
  // Join user's personal room for direct messages
  socket.join(`user-${socket.userId}`);
  
  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.userId);
  });
  
  // Listen for join conversation
  socket.on("join-conversation", (conversationId) => {
    socket.join(`conversation-${conversationId}`);
    console.log(`User ${socket.userId} joined conversation ${conversationId}`);
  });
  
  // Listen for leave conversation
  socket.on("leave-conversation", (conversationId) => {
    socket.leave(`conversation-${conversationId}`);
    console.log(`User ${socket.userId} left conversation ${conversationId}`);
  });
  
  // Handle user typing status
  socket.on("typing", ({ conversationId, isTyping }) => {
    socket.to(`conversation-${conversationId}`).emit("user-typing", {
      userId: socket.userId,
      isTyping
    });
  });
  
  // Handle user online status
  socket.on("set-status", (status) => {
    // Broadcast to all connected users
    socket.broadcast.emit("user-status-change", {
      userId: socket.userId,
      status
    });
  });
  
  // Handle video/audio call signaling
  socket.on("call-signal", ({ to, signal, callType }) => {
    console.log(`Call signal from ${socket.userId} to ${to}, type: ${callType}`)
    io.to(`user-${to}`).emit("call-signal", {
      from: socket.userId,
      signal,
      callType
    })
  })
  
  // User initiating a call
  socket.on("initiate-call", async ({ to, callType }) => {
    try {
      // Get caller user info to send to recipient
      const user = await mongoose.model('User').findById(socket.userId).select('name avatar').lean()
      
      console.log(`Call initiated from ${user.name} (${socket.userId}) to ${to}, type: ${callType}`)
      
      io.to(`user-${to}`).emit("incoming-call", {
        from: socket.userId,
        to, // Add this line for callee identification
        name: user.name,
        avatar: user.avatar,
        callType
      })
    } catch (error) {
      console.error("Error initiating call:", error)
    }
  })
  
  // Call accepted
  socket.on("call-accepted", ({ to, callType }) => {
    console.log(`Call accepted by ${socket.userId}, notifying ${to}`)
    io.to(`user-${to}`).emit("call-accepted", {
      from: socket.userId,
      callType
    })
  })
  
  // Call rejected
  socket.on("call-rejected", ({ to }) => {
    console.log(`Call rejected by ${socket.userId}, notifying ${to}`)
    io.to(`user-${to}`).emit("call-rejected", {
      from: socket.userId
    })
  })
  
  // Call ended
  socket.on("call-ended", ({ to }) => {
    console.log(`Call ended by ${socket.userId}, notifying ${to}`)
    io.to(`user-${to}`).emit("call-ended", {
      from: socket.userId
    })
  })
  
  // User is busy (already in another call)
  socket.on("user-busy", ({ to }) => {
    console.log(`User ${socket.userId} is busy, notifying ${to}`)
    io.to(`user-${to}`).emit("user-busy", {
      from: socket.userId
    })
  })
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  app.use(express.static(path.join(__dirname, '../build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Graceful port binding with retry logic if port is in use
const basePort = parseInt(process.env.PORT, 10) || 3001;
const maxAttempts = 5;

function attemptListen(port, attempt = 1) {
  server.listen(port, () => {
    if (attempt > 1) {
      console.log(`🚀 Server recovered and is now running on port ${port}`);
    } else {
      console.log(`🚀 Server running on port ${port}`);
    }
  });
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      if (attempt < maxAttempts) {
        console.warn(`⚠️  Port ${port} in use. Retrying with port ${port + 1} (attempt ${attempt + 1}/${maxAttempts})`);
        server.removeAllListeners('error');
        attemptListen(port + 1, attempt + 1);
      } else {
        console.error(`❌ All ${maxAttempts} port attempts failed starting from ${basePort}. Last error:`, err.message);
        process.exit(1);
      }
    } else {
      console.error('❌ Server start error:', err);
      process.exit(1);
    }
  });
}

attemptListen(basePort);
