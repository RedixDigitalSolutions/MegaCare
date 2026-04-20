require("dotenv").config();
require("express-async-errors");
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const seedDatabase = require("./seed");

const app = express();
const PORT = process.env.PORT || 5000;
// #17 — CORS origin from env only; no hardcoded fallback in production
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// #13 — Security headers via helmet
app.use(helmet());

// Middleware
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));

// Rate limiting — auth mutations only (login/register: 15 req / 15 min)
const authMutationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Trop de tentatives, réessayez dans 15 minutes" },
});

// Rate limiting — auth reads (profile etc: 120 req / 15 min)
const authReadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Trop de requêtes, réessayez dans quelques minutes" },
});

// Routes
app.use("/api/auth/login", authMutationLimiter);
app.use("/api/auth/register", authMutationLimiter);
app.use("/api/auth/profile", authReadLimiter);
app.use("/api/auth", require("./routes/auth"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/users", require("./routes/users"));
app.use("/api/doctors", require("./routes/doctors"));
app.use("/api/appointments", require("./routes/appointments"));
app.use("/api/prescriptions", require("./routes/prescriptions"));
app.use("/api/pharmacy", require("./routes/pharmacy"));
app.use("/api/pharmacies", require("./routes/pharmacies"));
app.use("/api/medicines", require("./routes/medicines"));
app.use("/api/lab", require("./routes/lab"));
app.use("/api/medical-service", require("./routes/medical-service"));
app.use("/api/paramedical", require("./routes/paramedical"));
app.use("/api/paramedical-catalog", require("./routes/paramedicalCatalog"));
app.use("/api/messages", require("./routes/messages"));
app.use("/api/dossier", require("./routes/dossier"));
app.use("/api/public", require("./routes/public"));

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
      process.env.JWT_SECRET,
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
    if (typeof partnerId !== "string" || !partnerId) return;
    console.log(`[socket] typing:start from ${uid} to ${partnerId}`);
    io.to(partnerId).emit("typing:start", uid);
  });
  socket.on("typing:stop", (partnerId) => {
    if (typeof partnerId !== "string" || !partnerId) return;
    io.to(partnerId).emit("typing:stop", uid);
  });

  // ── New message sent (via REST), broadcast to receiver ──
  socket.on("message:sent", (msg) => {
    if (!msg || typeof msg.receiverId !== "string" || !msg.receiverId) return;
    console.log(`[socket] message:sent from ${uid} to ${msg.receiverId}`);
    io.to(msg.receiverId).emit("message:receive", msg);
  });

  // ── WebRTC signaling ──
  socket.on("webrtc:offer", ({ to, offer }) => {
    if (typeof to !== "string" || !to || !offer) return;
    console.log(`[webrtc] offer from ${uid} to ${to}`);
    io.to(to).emit("webrtc:offer", { from: uid, offer });
  });

  socket.on("webrtc:answer", ({ to, answer }) => {
    if (typeof to !== "string" || !to || !answer) return;
    console.log(`[webrtc] answer from ${uid} to ${to}`);
    io.to(to).emit("webrtc:answer", { from: uid, answer });
  });

  socket.on("webrtc:ice-candidate", ({ to, candidate }) => {
    if (typeof to !== "string" || !to) return;
    io.to(to).emit("webrtc:ice-candidate", { from: uid, candidate });
  });

  socket.on("webrtc:call", ({ to }) => {
    if (typeof to !== "string" || !to) return;
    console.log(`[webrtc] call from ${uid} to ${to}`);
    io.to(to).emit("webrtc:call", { from: uid });
  });

  socket.on("webrtc:ready", ({ to }) => {
    if (typeof to !== "string" || !to) return;
    console.log(`[webrtc] ready from ${uid} to ${to}`);
    io.to(to).emit("webrtc:ready", { from: uid });
  });

  socket.on("webrtc:end", ({ to }) => {
    if (typeof to !== "string" || !to) return;
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
