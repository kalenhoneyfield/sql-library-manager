var express = require('express');
var router = express.Router();

/* GET no book found error page. */
router.get('/', function (req, res, next) {
  res.render('book-not-found', { title: 'Book Missing' });
});

module.exports = router;
