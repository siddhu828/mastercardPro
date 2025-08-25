const { Router } = require('express');
const { auth } = require('../middleware/auth');
const { getThread, sendMessage } = require('../controllers/chat_controller');

const router = Router();
router.get('/thread/:withUserId', auth(), getThread);
router.post('/send', auth(), sendMessage);

module.exports = router;