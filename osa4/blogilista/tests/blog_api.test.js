const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);

const Blog = require('../models/blog');

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('blog field "id" is defined', async () => {
  const blogs = await helper.blogsInDb();
  blogs.map(blog => expect(blog.id).toBeDefined());
});

test('a valid blog post can be added', async () => {
  const newBlog = {
    title: 'TEST - Does POST work as expected',
    author: 'Testaaja',
    url: 'https://www.example.com/testaajan-testi',
    likes: 22,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1);

  const title = blogsAtEnd.map(t => t.title);
  expect(title).toContain('TEST - Does POST work as expected');
});

test('a blog post with no "likes" gets 0 as default', async () => {
  const newBlog = {
    title: 'TEST - a zero like blog post',
    author: 'Testaaja 2',
    url: 'https://www.example.com/testaajan-nolla-likes',
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1);

  // Here we assume that the newBlog is the last one in the
  // returned results
  const like = blogsAtEnd.map(t => t.likes);
  expect(like[like.length - 1]).toBe(0);
});

test('a non-valid blog post cannot be added', async () => {
  const newBlog = {
    author: 'Testaaja 10',
    likes: 10,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd.length).toBe(helper.initialBlogs.length);
});

test('removing a single blog post works', async () => {
  const blogs = await helper.blogsInDb();
  const id = blogs[0].id;

  await api
    .delete(`/api/blogs/${id}`)
    .expect(204);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd.length).toBe(helper.initialBlogs.length - 1);
});

test('removing a non existing single blog post does not remove anything', async () => {
  const id = 'beef71f14f2492817beef4c5';

  await api
    .delete(`/api/blogs/${id}`)
    .expect(204);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd.length).toBe(helper.initialBlogs.length);
});

test('updating likes works', async () => {
  const blogs = await helper.blogsInDb();
  const blogToUpdate = { ...blogs[0] };
  blogToUpdate.likes = 200;
  const id = blogToUpdate.id;

  await api
    .put(`/api/blogs/${id}`)
    .send(blogToUpdate)
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

afterAll(() => {
  mongoose.connection.close();
});
