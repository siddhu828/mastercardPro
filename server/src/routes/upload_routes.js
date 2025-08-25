const { Router } = require('express');
const { auth } = require('../middleware/auth');
const { uploader, handleUpload } = require('../controllers/upload_controller');

const router = Router();
router.post('/document', auth(), uploader.single('file'), handleUpload);

module.exports = router;