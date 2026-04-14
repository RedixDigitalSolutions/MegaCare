const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { randomUUID } = require("crypto");
const Message = require("../models/Message");
const User = require("../models/User");

// GET /api/messages
router.get("/", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const result = await Message.find({
    $or: [{ senderId: userId }, { receiverId: userId }],
  }).lean();
  res.json(result.map((m) => ({ ...m, id: m._id })));
});

// GET /api/messages/conversations
router.get("/conversations", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const userMsgs = await Message.find({
    $or: [{ senderId: userId }, { receiverId: userId }],
  }).lean();

  const convMap = {};
  userMsgs.forEach((m) => {
    const partnerId = m.senderId === userId ? m.receiverId : m.senderId;
    const partnerName = m.senderId === userId ? m.receiverName : m.senderName;
    const partnerRole = m.senderId === userId ? m.receiverRole : m.senderRole;
    if (!convMap[partnerId]) {
      convMap[partnerId] = {
        partnerId,
        partnerName,
        partnerRole,
        lastMessage: { ...m, id: m._id },
        unread: 0,
        messages: [],
      };
    }
    convMap[partnerId].messages.push({ ...m, id: m._id });
    if (!m.read && m.receiverId === userId) {
      convMap[partnerId].unread++;
    }
    const msgDate = new Date(m.createdAt);
    const lastDate = new Date(convMap[partnerId].lastMessage.createdAt);
    if (msgDate > lastDate) {
      convMap[partnerId].lastMessage = { ...m, id: m._id };
    }
  });

  const conversations = Object.values(convMap).sort(
    (a, b) =>
      new Date(b.lastMessage.createdAt).getTime() -
      new Date(a.lastMessage.createdAt).getTime(),
  );

  res.json(conversations);
});

// GET /api/messages/thread/:partnerId
router.get("/thread/:partnerId", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { partnerId } = req.params;
  const thread = await Message.find({
    $or: [
      { senderId: userId, receiverId: partnerId },
      { senderId: partnerId, receiverId: userId },
    ],
  })
    .sort({ createdAt: 1 })
    .lean();

  // Mark received messages as read
  await Message.updateMany(
    { senderId: partnerId, receiverId: userId, read: false },
    { read: true },
  );

  res.json(thread.map((m) => ({ ...m, id: m._id })));
});

// POST /api/messages
router.post("/", authMiddleware, async (req, res) => {
  const { receiverId, content } = req.body;
  if (!receiverId || !content?.trim()) {
    return res.status(400).json({ message: "receiverId et content requis" });
  }

  const sender = await User.findById(req.user.id).lean();
  const receiver = await User.findById(receiverId).lean();
  if (!receiver) {
    return res.status(404).json({ message: "Destinataire non trouvé" });
  }

  const msg = await Message.create({
    _id: randomUUID(),
    senderId: req.user.id,
    senderName: sender ? sender.firstName + " " + sender.lastName : "Inconnu",
    senderRole: sender?.role || "unknown",
    receiverId,
    receiverName: receiver.firstName + " " + receiver.lastName,
    receiverRole: receiver.role,
    content: content.trim(),
    read: false,
  });
  res.status(201).json({ ...msg.toObject(), id: msg._id });
});

// GET /api/messages/contacts
router.get("/contacts", authMiddleware, async (req, res) => {
  const contacts = await User.find({
    _id: { $ne: req.user.id },
    status: "approved",
  })
    .select("-password")
    .lean();

  res.json(
    contacts.map((u) => ({
      id: u._id,
      name: u.firstName + " " + u.lastName,
      role: u.role,
      specialization: u.specialization,
    })),
  );
});

module.exports = router;
