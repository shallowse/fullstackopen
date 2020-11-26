// Usage: node createAuthorsBooksUsers.js
require('dotenv').config();
const mongoose = require('mongoose');
const Book = require('./models/book');
const Author = require('./models/author');
const User = require('./models/user');

const MONGODB_URI = process.env.MONGODB_URI;

let authors = [
  {
    name: 'Robert Martin',
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    born: 1821
  },
  {
    name: 'Joshua Kerievsky', // birthyear not known
  },
  {
    name: 'Sandi Metz', // birthyear not known
  },
];

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: authors[0].name, //author: 'Robert Martin'
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: authors[0].name, //author: 'Robert Martin'
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: authors[1].name, // 'Martin Fowler'
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: authors[3].name, // 'Joshua Kerievsky'
    genres: ['refactoring', 'patterns']
  },
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: authors[4].name, // 'Sandi Metz'
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: authors[2].name, // 'Fyodor Dostoevsky'
    genres: ['classic', 'crime']
  },
  {
    title: 'The Demon',
    published: 1872,
    author: authors[2].name, // 'Fyodor Dostoevsky'
    genres: ['classic', 'revolution']
  },
];

let users = [
  {
    username: 'sami',
    favoriteGenre: 'classic',
  },
  {
    username: 'tiina',
    favoriteGenre: 'refactoring',
  },
];

async function createAuthorsBooksUsers() {
  try {
    await mongoose.connect(MONGODB_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
      }
    );
    console.log('Connected to MongoDB');

    console.log('DELETE DATA ...\n');
    await Author.deleteMany({});
    await Book.deleteMany({});
    await User.deleteMany({});

    const retAuthors = await Author.insertMany(authors);
    console.log('\nAUTHORS ...\n', retAuthors);

    let retBooks = await Promise.all(books.map(async book => {
      const { _id } = await Author.findOne({ name: book.author });
      book.author = _id;
      return book;
    }));
    retBooks = await Book.insertMany(retBooks);
    console.log('\nBOOKS ...\n', retBooks);

    const retUsers = await User.insertMany(users);
    console.log('\nUSERS...\n', retUsers);

    mongoose.connection.close();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

createAuthorsBooksUsers();
