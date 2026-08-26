const Message = require('../models/Message');

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { productId, receiverId, text } = req.body;
    const message = await Message.create({
      product: productId,
      sender: req.userId,
      receiver: receiverId,
      text,
    });
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get conversation for a specific product between logged-in user and another user
const getConversation = async (req, res) => {
  try {
    const { productId, otherUserId } = req.params;
    const messages = await Message.find({
      product: productId,
      $or: [
        { sender: req.userId, receiver: otherUserId },
        { sender: otherUserId, receiver: req.userId },
      ],
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all conversations (inbox) for logged-in user
const getInbox = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.userId }, { receiver: req.userId }],
    })
      .populate('product', 'title images')
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
module.exports = { sendMessage, getConversation, getInbox };

