const blogRouter = require('express').Router();
const Blog = require('../models/blog');
//const logger = require('../utils/logger');

blogRouter.get('/', (req, res, next) => {
  Blog.find({})
    .then(blogs => res.json(blogs))
    .catch(error => next(error));
});

blogRouter.post('/', (req, res, next) => {
  const blog = new Blog(req.body);
  //logger.info(blog);

  blog.save()
    .then(result => res.status(201).json(result))
    .catch(error => next(error));
});

module.exports = blogRouter;
