const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    senderId: { type: String, required: true },
    senderName: String,
    senderRole: String,
    receiverId: { type: String, required: true },
    receiverName: String,
    receiverRole: String,
    content: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    _id: false,
  },
);

messageSchema.index({ senderId: 1 });
messageSchema.index({ receiverId: 1 });

module.exports = mongoose.model("Message", messageSchema);
