const express = require('express');
const router = express.Router();

const userController = require('../controller/userController');
const { authenticate } = require('../utils/middleware');

router.post('/create', authenticate,userController.createUser);
router.post('/list', authenticate,userController.getUsers);
router.delete('/delete/:id', authenticate,userController.deleteUser);
router.put('/update/:id', authenticate,userController.updateUser);
router.get('/get/:id', authenticate,userController.getUserById);


module.exports = router;