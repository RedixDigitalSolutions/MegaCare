const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { randomUUID } = require("crypto");
const Message = require("../models/Message");
const User = require("../models/User");

// GET /api/messages
router.get("/", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
  const skip = (page - 1) * limit;
  const filter = { $or: [{ senderId: userId }, { receiverId: userId }] };
  const [result, total] = await Promise.all([
    Message.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Message.countDocuments(filter),
  ]);
  res.json({
    data: result.map((m) => ({ ...m, id: m._id })),
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  });
});

// GET /api/messages/conversations
router.get("/conversations", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  const groups = await Message.aggregate([
    { $match: { $or: [{ senderId: userId }, { receiverId: userId }] } },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: {
          $cond: [{ $eq: ["$senderId", userId] }, "$receiverId", "$senderId"],
        },
        partnerName: {
          $first: {
            $cond: [
              { $eq: ["$senderId", userId] },
              "$receiverName",
              "$senderName",
            ],
          },
        },
        partnerRole: {
          $first: {
            $cond: [
              { $eq: ["$senderId", userId] },
              "$receiverRole",
              "$senderRole",
            ],
          },
        },
        lastMessage: { $first: "$$ROOT" },
        unread: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$receiverId", userId] },
                  { $eq: ["$read", false] },
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
    { $sort: { "lastMessage.createdAt": -1 } },
  ]);

  const conversations = groups.map((g) => ({
    partnerId: g._id,
    partnerName: g.partnerName,
    partnerRole: g.partnerRole,
    lastMessage: { ...g.lastMessage, id: g.lastMessage._id },
    unread: g.unread,
  }));

  res.json(conversations);
});

// GET /api/messages/thread/:partnerId
router.get("/thread/:partnerId", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { partnerId } = req.params;
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
  const skip = (page - 1) * limit;
  const filter = {
    $or: [
      { senderId: userId, receiverId: partnerId },
      { senderId: partnerId, receiverId: userId },
    ],
  };
  const [thread, total] = await Promise.all([
    Message.find(filter).sort({ createdAt: 1 }).skip(skip).limit(limit).lean(),
    Message.countDocuments(filter),
  ]);

  // Mark received messages as read
  await Message.updateMany(
    { senderId: partnerId, receiverId: userId, read: false },
    { read: true },
  );

  res.json({
    data: thread.map((m) => ({ ...m, id: m._id })),
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  });
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
