const express = require('express');
const router = express.Router();
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
    const limit = isNaN(req.query.limit) ? 10 : req.query.limit;
    const page = isNaN(req.query.page) ? 1 : req.query.page;
    let offset = page ? (page - 1) * limit : 0;
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
      pageNum: page,
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
      res.render('view-book', { book: book, title: book.title, create: true });
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
      res.redirect('/bookNotFound');
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
      res.redirect('/bookNotFound');
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
        book = await book.update(req.body);
        res.render('view-book', { book: book, title: book.title, update: true });
      } else {
        res.redirect('/bookNotFound');
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
      res.redirect('/bookNotFound');
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
      res.redirect('/bookNotFound');
    }
  })
);

module.exports = router;
