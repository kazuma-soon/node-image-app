const express = require('express');
const router = express.Router();
const fs = require('fs');

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

// -- pg
//const { Client } = require('pg');
//const client = new Client({
//	user: 'postgres',
//  host: 'localhost',
//  database: 'node_image_app',
//  port: 5432,
//});
//client.connect();

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
