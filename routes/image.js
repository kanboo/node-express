var express = require('express');
var router = express.Router();

const multer = require('multer')
const upload = multer({
  limits: {
    // 限制上傳檔案的大小為 1MB
    fileSize: 1 * 1024 * 1024
  },
  fileFilter(req, file, cb) {
    // 只接受三種圖片格式
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb(new Error('Please upload an image'))
    }

    // Success
    cb(null, true)
  }
})

const ImageController = require('../controllers/image')

router.post(
  '/',
  upload.single('image'),
  ImageController.createImage,
  (error, req, res, next) => {
    // 上傳失敗，丟出錯誤訊息時執行
    res.status(400).send({ error: error.message })
  }
);

module.exports = router;
