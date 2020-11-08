const Blog = require('../models/blog');
const User = require('../models/users');

const initialBlogs = [
  {
    title: 'TEST - React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    user: undefined,
  },
  {
    title: 'TEST - Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    user: undefined,
  },
  {
    title: 'TEST - Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    user: undefined,
  },
  {
    title: 'TEST - First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    user: undefined,
  },
  {
    title: 'TEST - TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    user: undefined,
  },
  {
    title: 'TEST - Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    user: undefined,
  }
];

const initialUsers = [
  {
    username: 'sannatestaaja',
    name: 'Sanna Testaaja',
    password: 'secret',
    passwordHash: undefined,
    token: undefined,
    _id: undefined,
  },
  {
    username: 'seppotester',
    name: 'Seppo Tester',
    password: 'secret',
    passwordHash: undefined,
    token: undefined,
    _id: undefined,
  }
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map(blog => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map(user => user.toJSON());
};

module.exports = {
  initialBlogs,
  initialUsers,
  blogsInDb,
  usersInDb,
};
