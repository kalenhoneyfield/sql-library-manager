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

/* get the base search route should look like the books page but with fewer books */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const query = req.query.query || '';
    const limit = isNaN(req.query.limit) ? 10 : req.query.limit; //not sure why but the try catch block wasn't catching this error if a user typed something goofy in
    const page = isNaN(req.query.page) ? 1 : req.query.page;
    let offset = (page - 1) * limit;
    let books;
    try {
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
        pageNum: page,
        limit: 10,
        numberOfLinks: pagiLinksTotal,
      });
    } catch (err) {
      throw err;
    }
  })
);

/* Search books */
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const limit = 10;
    const query = req.body.search;
    const page = isNaN(req.query.page) ? 1 : req.query.page;
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
      pageNum: page,
      total: count,
      numberOfLinks: pagiLinksTotal,
    });
  })
);

module.exports = router;
