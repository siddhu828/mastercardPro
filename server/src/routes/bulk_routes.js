const { Router } = require('express');
const multer = require('multer');
const { auth } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const { bulkCreate } = require('../controllers/bulk_controller');

const upload = multer();
const router = Router();

router.post('/students', auth(), requireRole('admin','clerk'), upload.single('file'), bulkCreate);

module.exports = router;