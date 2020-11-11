const router = require('express').Router();
const User = require('../models/users');
const Blog = require('../models/blog');
const Comment = require('../models/comment');

router.post('/reset', async (req, res) => {
  await User.deleteMany({});
  await Blog.deleteMany({});
  await Comment.deleteMany({});

  res.status(204).end();
});

module.exports = router;