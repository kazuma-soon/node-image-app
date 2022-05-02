const express = require('express');
const router = express.Router();

const { Client } = require('pg');
const client = new Client({
	user: 'postgres',
  host: 'localhost',
  database: 'node_image_app',
  port: 5432,
});
client.connect();

router.get('/', (req, res, next) => {
	client
	  .query('SELECT * FROM images')
	  .then(results => {
			console.log(results.rows)
      res.render('images.ejs', {
        imgs: results.rows,
      });			
		})
	  .catch(e => {
			console.error(e);
		})
})

router.post('/', (req, res, next) => {
	console.log(req.body.image);
	client
	  .query('INSERT INTO images (img) VALUES ($1)', [req.body.image])
	  .then(results => {
			res.redirect('/images');
		})
	  .catch(e => {
			console.error(e);
		})
})

module.exports = router;
