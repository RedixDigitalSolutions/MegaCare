require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const connectDB = require("./config/db");
const seedDatabase = require("./seed");

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// Middleware
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/users", require("./routes/users"));
app.use("/api/doctors", require("./routes/doctors"));
app.use("/api/appointments", require("./routes/appointments"));
app.use("/api/prescriptions", require("./routes/prescriptions"));
app.use("/api/pharmacy", require("./routes/pharmacy"));
app.use("/api/messages", require("./routes/messages"));
app.use("/api/dossier", require("./routes/dossier"));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Socket.IO real-time messaging ──────────────────────────────
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: FRONTEND_URL, credentials: true },
});

// Map userId → Set of socket ids
const onlineUsers = new Map();

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("Authentication required"));
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "megacare_secret_key",
    );
    socket.userId = decoded.id;
    socket.userRole = decoded.role;
    next();
  } catch {
    next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  const uid = socket.userId;
  console.log(`[socket] user connected: ${uid} (socket ${socket.id})`);

  // Track online status
  if (!onlineUsers.has(uid)) onlineUsers.set(uid, new Set());
  onlineUsers.get(uid).add(socket.id);

  // Join personal room
  socket.join(uid);

  // Notify partner(s) this user is online
  socket.broadcast.emit("user:online", uid);

  // Send current online list to newly connected user
  socket.emit("users:online", Array.from(onlineUsers.keys()));

  // ── Typing indicators ──
  socket.on("typing:start", (partnerId) => {
    console.log(`[socket] typing:start from ${uid} to ${partnerId}`);
    io.to(partnerId).emit("typing:start", uid);
  });
  socket.on("typing:stop", (partnerId) => {
    io.to(partnerId).emit("typing:stop", uid);
  });

  // ── New message sent (via REST), broadcast to receiver ──
  socket.on("message:sent", (msg) => {
    console.log(`[socket] message:sent from ${uid} to ${msg.receiverId}`);
    io.to(msg.receiverId).emit("message:receive", msg);
  });

  // ── WebRTC signaling ──
  socket.on("webrtc:offer", ({ to, offer }) => {
    console.log(`[webrtc] offer from ${uid} to ${to}`);
    io.to(to).emit("webrtc:offer", { from: uid, offer });
  });

  socket.on("webrtc:answer", ({ to, answer }) => {
    console.log(`[webrtc] answer from ${uid} to ${to}`);
    io.to(to).emit("webrtc:answer", { from: uid, answer });
  });

  socket.on("webrtc:ice-candidate", ({ to, candidate }) => {
    io.to(to).emit("webrtc:ice-candidate", { from: uid, candidate });
  });

  socket.on("webrtc:call", ({ to }) => {
    console.log(`[webrtc] call from ${uid} to ${to}`);
    io.to(to).emit("webrtc:call", { from: uid });
  });

  socket.on("webrtc:ready", ({ to }) => {
    console.log(`[webrtc] ready from ${uid} to ${to}`);
    io.to(to).emit("webrtc:ready", { from: uid });
  });

  socket.on("webrtc:end", ({ to }) => {
    console.log(`[webrtc] end from ${uid}`);
    io.to(to).emit("webrtc:end", { from: uid });
  });

  // ── Disconnect ──
  socket.on("disconnect", () => {
    console.log(`[socket] user disconnected: ${uid}`);
    const sockets = onlineUsers.get(uid);
    if (sockets) {
      sockets.delete(socket.id);
      if (sockets.size === 0) {
        onlineUsers.delete(uid);
        socket.broadcast.emit("user:offline", uid);
      }
    }
  });
});

// Start server after connecting to MongoDB
(async () => {
  await connectDB();
  await seedDatabase();
  server.listen(PORT, () => {
    console.log(`MegaCare API server running on port ${PORT}`);
  });
})();

module.exports = app;
