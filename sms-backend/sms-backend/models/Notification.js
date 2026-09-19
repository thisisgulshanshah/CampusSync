const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  _id: { type: String },
  senderId: { type: String, required: true },
  senderRole: { type: String },
  senderName: { type: String },
  recipientType: { type: String, default: "all" },
  recipientId: { type: String, default: null },
  title: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
