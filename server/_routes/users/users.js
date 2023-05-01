// routes/user.routes.js
const express = require('express');
const userController = require('../../_controller/users/users');
const router = express.Router();
router.get('/:uid', userController.getUserByUid);
router.post('/',userController.postUser)
module.exports = router;
