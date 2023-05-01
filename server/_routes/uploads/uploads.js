const express = require('express');
const router = express.Router();
const imageController = require('../../_controller/uploads/uploads');

router.post('/upload', imageController.uploadImage, imageController.processImage);

module.exports = router;
