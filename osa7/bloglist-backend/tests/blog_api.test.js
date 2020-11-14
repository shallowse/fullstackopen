const supertest = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);

const Blog = require('../models/blog');
const User = require('../models/users');

// https://stackoverflow.com/a/1584377
function arrayUnique(array) {
  let a = array.concat();
  for (let i = 0; i < a.length; i++) {
    for (let j = i + 1; j < a.length; j++) {
      if (a[i].username === a[j].username) {
        a[i]._id = a[j]._id;
        a.splice(j--, 1);
      }
    }
  }
  return a;
}

describe('Testing Blog API', () => {
  let users = [...helper.initialUsers];

  beforeEach(async () => {
    // USERS
    //  1. delete current users from test database
    //  2. create users to test database
    //  3. login with users to receive the JSON Web Token for Authorization header
    await User.deleteMany({});

    // https://stackoverflow.com/a/40140562
    // Promise.all
    users = await Promise.all(users.map(async user => {
      const passwordHash = await bcrypt.hash(user.password, 10);
      user.passwordHash = passwordHash;
      return user;
    }));
    const savedUsers = await User.insertMany(users);

    users = arrayUnique(users.concat(savedUsers));
    //console.log('USERS after merge', users, users.length);

    await Promise.all(users.map(async user => {
      const result = await api
        .post('/api/login')
        .send({ username: user.username, password: user.password });
      user.token = `Bearer ${result.body.token}`;
    }));
    // console.log('USERS after token creation', users);


    // BLOGS
    //  1. delete current blogs from test database
    //  2. populate blog.user with user ids
    //  2. insert blogs to test database
    await Blog.deleteMany({});

    let index = 0;
    helper.initialBlogs.forEach(blog => {
      blog.user = users[index++ % users.length]._id;
    });
    //console.log(initialBlogs);
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
      user: users[0]._id,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', users[0].token)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1);

    const title = blogsAtEnd.map(t => t.title);
    expect(title).toContain('TEST - Does POST work as expected');
  });

  test('a valid blog post with missing authorization token cannot be added', async () => {
    const newBlog = {
      title: 'TEST - Does POST work as expected',
      author: 'Testaaja',
      url: 'https://www.example.com/testaajan-testi',
      likes: 22,
      user: users[0]._id,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length);
  });

  test('a blog post with no "likes" gets 0 as default', async () => {
    const newBlog = {
      title: 'TEST - a zero like blog post',
      author: 'Testaaja 2',
      url: 'https://www.example.com/testaajan-nolla-likes',
    };

    let result = await api
      .post('/api/blogs')
      .set('Authorization', users[0].token)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1);

    result = await api
      .get(`/api/blogs/${result.body.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(result.body.likes).toBe(0);
  });

  test('a non-valid (title, url missing) blog post cannot be added', async () => {
    const newBlog = {
      author: 'Testaaja 10',
      likes: 10,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', users[0].token)
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length);
  });

  test('removing a single blog post works', async () => {
    const blogs = await helper.blogsInDb();
    const blogId = blogs[0].id;
    const blogUserId = blogs[0].user.toString();
    let userToken = users.find(user => String(user._id).localeCompare(blogUserId) === 0);

    await api
      .delete(`/api/blogs/${blogId}`)
      .set('Authorization', userToken.token)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length - 1);
  });

  test('trying to remove a single blog post with non-valid authorization token fails', async () => {
    const blogs = await helper.blogsInDb();
    const blogId = blogs[0].id;
    const blogUserId = blogs[0].user.toString();
    let userToken = users.find(user => String(user._id).localeCompare(blogUserId) !== 0);

    const result = await api
      .delete(`/api/blogs/${blogId}`)
      .set('Authorization', userToken.token)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('not authorized to delete a blog post');

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length);
  });

  test('removing a non existing single blog post does not remove anything', async () => {
    const id = 'beef71f14f2492817beef4c5';

    const result = await api
      .delete(`/api/blogs/${id}`)
      .set('Authorization', users[0].token)
      .expect(404)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('blog not found');

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length);
  });

  test('updating likes works', async () => {
    const blogs = await helper.blogsInDb();
    const blogToUpdate = { ...blogs[0] };
    blogToUpdate.likes = 200;
    const blogId = blogToUpdate.id;

    const result = await api
      .put(`/api/blogs/${blogId}`)
      .send(blogToUpdate)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(result.body.likes).toBe(200);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
