const express = require('express');
const router = express.Router();

const roleController = require('../controller/roleController');
const { authenticate } = require('../utils/middleware');

router.post('/create', authenticate,roleController.createRole);
router.post('/list', authenticate,roleController.getRoles);
router.post('/assign', authenticate,roleController.assignRole);
router.get('/get/:id', authenticate, roleController.getRoleById);

module.exports = router;