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

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const query = req.query.query;
    const limit = req.query.limit;
    let offset = (req.query.page - 1) * limit;
    let books;
    const { count, rows } = await Book.findAndCountAll({
      where: {
        [Op.or]: [
          {
            title: {
              [Op.like]: `%${query}%`,
            },
          },
          {
            author: {
              [Op.like]: `%${query}%`,
            },
          },
          {
            genre: {
              [Op.like]: `%${query}%`,
            },
          },
          {
            year: {
              [Op.like]: `%${query}%`,
            },
          },
        ],
      },
      order: [['year', 'DESC']],
      offset: offset,
      limit: limit,
    });
    books = rows;
    const pagiLinksTotal = Math.ceil(count / limit);

    res.render('index', {
      books: books,
      title: 'Books',
      query: query,
      total: count,
      limit: 10,
      numberOfLinks: pagiLinksTotal,
    });
  })
);

/* Search books */
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const limit = 10;
    const query = req.body.search;
    let books;
    const { count, rows } = await Book.findAndCountAll({
      where: {
        [Op.or]: [
          {
            title: {
              [Op.like]: `%${query}%`,
            },
          },
          {
            author: {
              [Op.like]: `%${query}%`,
            },
          },
          {
            genre: {
              [Op.like]: `%${query}%`,
            },
          },
          {
            year: {
              [Op.like]: `%${query}%`,
            },
          },
        ],
      },
      order: [['year', 'DESC']],
      offset: 0,
      limit: limit,
    });
    books = rows;
    const pagiLinksTotal = Math.ceil(count / limit);
    res.render('index', {
      books: books,
      title: 'Books',
      query: query,
      limit: limit,
      total: count,
      numberOfLinks: pagiLinksTotal,
    });

    // res.render('index', { books: books, title: 'Books' });
  })
);

module.exports = router;
