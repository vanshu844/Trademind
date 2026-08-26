const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const { sendMessage, getConversation, getInbox } = require('../controllers/chatController');

router.post('/', protect, sendMessage);
router.get('/inbox', protect, getInbox);
router.get('/:productId/:otherUserId', protect, getConversation);

module.exports = router;