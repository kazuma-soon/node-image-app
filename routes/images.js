const express = require('express');
const router = express.Router();

require('dotenv').config();
const fs = require('fs');
// const aws = require('aws-sdk');
// const s3 = new aws.S3({
//   accessKeyId: process.env.accessKeyId,
//   secretAccessKey: process.env.secretAccessKey,
//   region: process.env.region,
// });
// const multerS3 = require('multer-s3');
// -- multer
const multer  = require('multer')
const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, './public/images/')
  },
  filename: function(req, file, cb){
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})
const upload = multer({ storage: storage })
// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: 'node-image-app2',
//     metadata: function (req, file, cb) {
//       cb(null, {fieldName: file.fieldname});
//     },
//     key: function (req, file, cb) {
//       cb(null, Date.now().toString())
//     }
//   })
// })

// Get images
router.get('/images', (req, res, next) => {
  const images = fs.readdirSync('./public/images/');
  
  if (images.length >= 0) {
    res.render('images.ejs', { images: images });
  }
  else {
    consosle.error('There is something wrong about fs / images!');
  }
})

// Create images
router.post('/images/upload', upload.single('image'), (req, res, next) => {
  if (req.file) {
    console.log('Image uploaded!');
    res.redirect('/images');
  }
  else {
    console.log('Image can not uploaded!')
    res.render('image.ejs');
  }
})

module.exports = router;
