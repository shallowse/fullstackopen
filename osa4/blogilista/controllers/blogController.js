const jwt = require('jsonwebtoken');
const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/users');

blogRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 });
  res.json(blogs.map(blog => blog.toJSON()));
});

blogRouter.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate('user', { username: 1, name: 1, id: 1 });
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
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  res.status(201).json(savedBlog.toJSON());
});

/*
  1. Fetch user from database
  2. Fetch blog entry to be deleted from database
  3. Compare user.id with blog.user.id
     if they match => delete blog entry
     else => user is not authorized to delete the blog entry
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

  const updatedBlog = await Blog.findByIdAndUpdate(blogId, blog, { new: true })
    .populate('user', { username: 1, name: 1, id: 1 });
  res.status(200).json(updatedBlog.toJSON());
});

module.exports = blogRouter;
