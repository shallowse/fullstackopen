const jwt = require('jsonwebtoken');
const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/users');
const Comment = require('../models/comment');

/*
  Routes:                 (HTTP VERBS)
  ------------------------------------
  /api/blogs              (GET, POST)
  /api/blogs/:id          (GET, PUT, DELETE)
  /api/blogs/:id/comments (POST)
*/

blogRouter.get('/', async (req, res) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1, id: 1 })
    .populate('comments', { content: 1 });
  res.json(blogs.map(blog => blog.toJSON()));
});

blogRouter.get('/:id', async (req, res) => {
  const blog = await Blog
    .findById(req.params.id)
    .populate('user', { username: 1, name: 1, id: 1 })
    .populate('comments', { content: 1 });
  res.json(blog.toJSON());
});

blogRouter.post('/', async (req, res) => {
  const body = req.body;
  if (!req.token) {
    return res.status(401).json({ error: 'missing header "Authorization"' });
  }
  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  if (!(decodedToken && decodedToken.id)) {
    return res.status(401).json({ error: 'invalid decoded token id' });
  }

  const user = await User.findById(decodedToken.id);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    likes: body.likes === undefined ? 0 : body.likes,
    url: body.url,
    user: user._id,
    comments: [],
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  const retBlog = await Blog.findById(savedBlog._id).populate('user', { username: 1, name: 1, id: 1 });
  res.status(201).json(retBlog.toJSON());
});

/*
  1. Fetch user from database
  2. Fetch blog entry to be deleted from database
  3. Compare user.id with blog.user.id
     if they match => delete blog entry
     else => user is not authorized to delete the blog entry

  4. Fetch comments for blog from database and delete the comments
*/
blogRouter.delete('/:id', async (req, res) => {
  const blogId = req.params.id;
  if (!req.token) {
    return res.status(401).json({ error: 'missing header "Authorization"' });
  }
  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  if (!(decodedToken && decodedToken.id)) {
    return res.status(401).json({ error: 'invalid decoded token id' });
  }

  const user = await User.findById(decodedToken.id);
  const blog = await Blog.findById(blogId);
  if (!blog) {
    return res.status(404).json({ error: 'blog not found' });
  }

  // Is user authorized to delete a blog post
  if (String(user._id).localeCompare(blog.user._id.toString()) !== 0) {
    return res.status(401).json({ error: 'not authorized to delete a blog post' });
  }
  await Blog.findByIdAndRemove(blogId);

  // Delete blog's comments
  await Comment.deleteMany({ blog: blogId });

  res.status(204).end();
});

blogRouter.put('/:id', async (req, res) => {
  const blogId = req.params.id;
  const body = req.body;

  const user = await User.findById(req.body.user);

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  };

  const updatedBlog = await Blog
    .findByIdAndUpdate(blogId, blog, { new: true })
    .populate('user', { username: 1, name: 1, id: 1 })
    .populate('comments', { content: 1 });
  res.status(200).json(updatedBlog.toJSON());
});

blogRouter.post('/:id/comments', async (req, res) => {
  const blogId = req.params.id;

  const comment = new Comment({
    blog: blogId,
    content: req.body.content,
  });

  const savedComment = await comment.save();

  const retBlog = await Blog.findById(blogId);
  const comments = retBlog.comments.concat(savedComment);
  retBlog.comments = comments;

  const updatedBlog = await Blog
    .findByIdAndUpdate(blogId, retBlog, { new: true })
    .populate('user', { username: 1, name: 1, id: 1 })
    .populate('comments', { content: 1 });

  res.status(201).json(updatedBlog.toJSON());
});

module.exports = blogRouter;
