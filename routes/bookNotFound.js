var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('book-not-found', { title: 'Book Missing' });
});

module.exports = router;
