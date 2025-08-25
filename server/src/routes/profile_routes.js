const { Router } = require('express');
const { auth } = require('../middleware/auth');
const { getMyProfile, upsertMyProfile, deactivateMyProfile } = require('../controllers/profile_controller');

const router = Router();
router.get('/me', auth(), getMyProfile);
router.put('/me', auth(), upsertMyProfile);
router.patch('/me/deactivate', auth(), deactivateMyProfile);

module.exports = router;