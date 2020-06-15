const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const Book = require('../models').Book;

const db = require('../models');
const { Op } = db.Sequelize;

//catch server side errors in one place
function asyncHandler(callback) {
  return async (req, res, next) => {
    try {
      await callback(req, res, next);
    } catch (error) {
      res.status(500).send(error);
    }
  };
}

/* GET all books listing. */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const limit = req.query.limit || 10;
    let offset = req.query.page ? (req.query.page - 1) * limit : 0;
    let books;
    const { count, rows } = await Book.findAndCountAll({
      order: [['year', 'DESC']],
      offset: offset,
      limit: limit,
    });
    books = rows;
    const pagiLinksTotal = Math.ceil(count / limit);

    res.render('index', {
      books: books,
      title: 'Books',
      total: count,
      limit: 10,
      numberOfLinks: pagiLinksTotal,
    });
  })
);

/* Create a new book form. */
router.get('/new', (req, res) => {
  res.render('new-book', { books: {}, title: 'New Book' });
});

/* POST new book */
router.post(
  '/new',
  asyncHandler(async (req, res) => {
    console.log(req.body);
    let book;
    try {
      book = await Book.create(req.body);
      res.redirect('/books/' + book.id);
    } catch (err) {
      if (err.name === 'SequelizeValidationError') {
        book = await Book.build(req.body);
        res.render('new-book', {
          book: book,
          errors: err.errors,
          title: `New Book: Oops looks like we're missing something`,
        });
      } else {
        throw err;
      }
    }
  })
);

/* GET a book */
router.get(
  '/:id',
  asyncHandler(async (req, res, next) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.render('view-book', { book: book, title: book.title });
    } else {
      next(createError(404));
    }
  })
);

/* Edit specific book form. */
router.get(
  '/:id/edit',
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.render('update-book', { book: book, title: `Edit: ${book.title}` });
    } else {
      next(createError(404));
    }
  })
);

/* Rubric asks for /:id during refactor this post route should go back to /:id/edit */
/* Update a single book */
router.post(
  '/:id',
  asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.findByPk(req.params.id);
      if (book) {
        await book.update(req.body);
        res.redirect('/books/' + book.id);
      } else {
        next(createError(404));
      }
    } catch (err) {
      if (err.name === 'SequelizeValidationError') {
        book = await Book.build(req.body);
        book.id = req.params.id;
        res.render('update-book', {
          book: book,
          errors: err.errors,
          title: `Edit: Oops looks like we're missing something`,
        });
      } else {
        throw err;
      }
    }
  })
);

/* Using a route here saves us the hassle of setting up some cute javascript confirmation modal may revisit later */
/* Delete book */
router.get(
  '/:id/delete',
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.render('delete-book', { book: book, title: book.title });
    } else {
      res.sendStatus(404);
    }
  })
);

/* Delete a book */
router.post(
  '/:id/delete',
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      await book.destroy();
      res.redirect('/books');
    } else {
      res.sendStatus(404);
    }
  })
);

module.exports = router;
