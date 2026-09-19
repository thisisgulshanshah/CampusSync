const Notification = require("../models/Notification");

// GET /api/notifications?recipientId=&recipientType=&unreadOnly=
const getNotifications = async (req, res) => {
  try {
    const { recipientId, recipientType, unreadOnly } = req.query;
    const query = {};

    // Filter: recipient-specific OR broadcast
    if (recipientId) {
      query.$or = [
        { recipientId: recipientId },
        { recipientType: "all" }
      ];
      if (recipientType) {
        query.$or.push({ recipientType: recipientType });
      }
    }
    if (unreadOnly === "true") query.isRead = false;

    const notifications = await Notification.find(query).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/notifications/unread-count?recipientId=&recipientType=
const getUnreadCount = async (req, res) => {
  try {
    const { recipientId, recipientType } = req.query;
    const query = { isRead: false };

    if (recipientId) {
      query.$or = [
        { recipientId: recipientId },
        { recipientType: "all" }
      ];
      if (recipientType) {
        query.$or.push({ recipientType: recipientType });
      }
    }

    const count = await Notification.countDocuments(query);
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST /api/notifications
const sendNotification = async (req, res) => {
  try {
    const { senderId, senderRole, senderName, recipientType, recipientId, title, message } = req.body;
    if (!title || !message) return res.status(400).json({ message: "Title and message are required" });
    
    const notif = await Notification.create({
      senderId: senderId || "unknown", 
      senderRole: senderRole || "admin",
      senderName: senderName || "System", 
      recipientType: recipientType || "all",
      recipientId: recipientId || null, 
      title, 
      message, 
      isRead: false
    });
    res.status(201).json(notif);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/notifications/:id/read
const markAsRead = async (req, res) => {
  try {
    const updated = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    if (!updated) return res.status(404).json({ message: "Notification not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/notifications/read-all
const markAllAsRead = async (req, res) => {
  try {
    const { recipientId, recipientType } = req.body;
    const query = { isRead: false };

    if (recipientId) {
      query.$or = [
        { recipientId: recipientId },
        { recipientType: "all" }
      ];
      if (recipientType) {
        query.$or.push({ recipientType: recipientType });
      }
    }

    const result = await Notification.updateMany(query, { isRead: true });
    res.json({ message: `Marked ${result.modifiedCount} notifications as read` });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getNotifications, getUnreadCount, sendNotification, markAsRead, markAllAsRead };
