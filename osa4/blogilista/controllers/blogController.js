const blogRouter = require('express').Router();
const Blog = require('../models/blog');

blogRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({});
  res.json(blogs.map(blog => blog.toJSON()));
});

blogRouter.post('/', async (req, res) => {
  const blog = new Blog(req.body);

  const savedBlog = await blog.save();
  res.status(201).json(savedBlog.toJSON());
});

blogRouter.delete('/:id', async (req, res) => {
  const id = req.params.id;
  await Blog.findByIdAndRemove(id);
  res.status(204).end();
});

blogRouter.put('/:id', async (req, res) => {
  const id = req.params.id;
  const body = req.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(id, blog, { new: true });
  res.status(200).json(updatedBlog.toJSON());
});

module.exports = blogRouter;
