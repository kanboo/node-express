var express = require('express');
var router = express.Router();

const ImageController = require('../controllers/image')

router.post('/', ImageController.createImage);

module.exports = router;
