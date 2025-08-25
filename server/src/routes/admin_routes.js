const { Router } = require('express');
const { auth } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const { listStudents, defineDynamicFields } = require('../controllers/admin_controller');

const router = Router();
router.get('/students', auth(), requireRole('admin','clerk'), listStudents);
router.post('/dynamic-fields', auth(), requireRole('admin'), defineDynamicFields);

module.exports = router;