const { ApolloServer, UserInputError, gql, AuthenticationError, PubSub } = require('apollo-server');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const pubsub = new PubSub();
const BOOK_ADDED = 'BOOK_ADDED';

const mongoose = require('mongoose');
const Book = require('./models/book');
const Author = require('./models/author');
const User = require('./models/user');

const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.SECRET;

mongoose.connect(MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(() => console.log('connected to MongoDB'))
  .catch(error => console.error('error connecting to MongoDB:', error.message));

// http://spec.graphql.org/draft/
const typeDefs = gql`
  type Book {
    id: ID!
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
  }

  type Author {
    id: ID!
    name: String!
    born: Int
    bookCount: Int!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    allGenres: [String!]
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book

    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author

    createUser(
      username: String!
      favoriteGenre: String!
    ): User

    login(
      username: String!
      password: String!
    ): Token
  }

  type Subscription {
    bookAdded: Book
  }
`;

const resolvers = {
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator([BOOK_ADDED]),
    }
  },
  Query: {
    bookCount: () => Book.countDocuments(),
    authorCount: () => Author.countDocuments(),
    allBooks: async (parent, args) => {
      let retArray = [];
      // https://stackoverflow.com/a/32108184
      if (Object.keys(args).length === 0) {
        retArray = await Book.find({}).populate('author');
        return retArray;
      }

      if (args.author && args.genre) {
        const S = await Author.findOne({ name: args.author });
        if (S !== null) {
          retArray = await Book.find(
            {
              author: S._id,
              genres: { $in: [args.genre] }
            }
          ).populate('author');
        }

      } else if (args.author && !args.genre) {
        const S = await Author.findOne({ name: args.author });
        retArray = await Book.find({ author: S._id }).populate('author');

      } else if (!args.author && args.genre) {
        retArray = await Book.find({ genres: { $in: [args.genre] } }).populate('author');

      } else { // Something weird must have happened?
        retArray = [];
      }

      //console.log(retArray);
      return retArray;
    },
    allAuthors: async () => {
      // 1. find the authors
      // 2. traverse the authors' list and generate the bookCount
      const authors = await Author.find({});

      const retArray = await Promise.all(authors.map(async S => {
        const books = await Book.find({ author: S._id });
        return {
          id: S._id,
          name: S.name,
          born: S.born || null,
          bookCount: books.length,
        };
      }));

      return retArray;
    },
    allGenres: async () => {
      // 1. fetch all the genres from books to a list
      // 2. remove duplicates from the list and return it
      const bookGenres = await Book.find({}).select({ 'genres': 1 });
      const genreArray = bookGenres.map(S => S.genres).flat();

      // https://codeburst.io/javascript-array-distinct-5edc93501dc4
      const retArray = [...new Set(genreArray)];
      //console.log(retArray);

      return retArray;
    },
    me: (parent, args, context) => {
      return context.currentUser;
    }
  },
  Author: {
    bookCount: async (parent) => {
      /* Generate bookCount field for the author

      (parent) has two types of content depending on the query e.g.:

      (1) allAuthors
      Why id and not _id:
        Check the above allAuthors() resolver function's return object.

      query {
        allAuthors {
          id
          name
          bookCount
        }
      }

      parent: {
        id: 5fb68002c6b4fb796928062f,
        name: 'Robert Martin',
        born: 1952,
        bookCount: 2
      }

      ====================

      (2) allBooks
      Why _id:
        Check the above allBooks() resolver function's return array of objects.

      query {
        allAbooks {
          title
          author {
            id
            name
            bookCount
          }
        }
      }

      parent: {
        _id: 5fb68002c6b4fb796928062f,
        name: 'Robert Martin',
        born: 1952,
        __v: 0
      }

      ====================

      Note: for this implementation I decided to handle the 'id', '_id' issue here.
      */
      //console.log(parent);
      const id = parent._id || parent.id;
      const bookCount = await Book.find({ author: id });
      return bookCount.length;
    },
  },
  Mutation: {
    addBook: async (parent, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError('not authenticated');
      }

      // 1. find author, if author not in authors (in database), create new author to authors
      // 2. add book to books
      let author = await Author.findOne({ name: args.author });
      if (author === null) {
        try {
          author = new Author({ name: args.author });
          author = await author.save();
        } catch (error) {
          //console.log(error);
          throw new UserInputError(error.message, {
            invalidArgs: args,
          });
        }
      }

      let book = new Book({ ...args, author: author.id });
      try {
        book = await book.save();
        book = await Book.findOne({ _id: book._id }).populate('author');
      } catch (error) {
        //console.log(error);
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }

      // generate bookCount field for the author
      const bookCount = await Book.find({ author: author._id });
      book.author.bookCount = bookCount.length;

      pubsub.publish(BOOK_ADDED, { bookAdded: book });

      return book;
    },
    editAuthor: async (parent, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError('not authenticated');
      }

      // 1. find author, if not found, return null
      // 2. update author born field
      // 3. generate bookCount field for the author
      const authorFound = await Author.findOne({ name: args.name });
      if (!authorFound) {
        return null;
      }
      authorFound.born = args.born;

      let author;
      try {
        author = await Author.findOneAndUpdate({ _id: authorFound._id }, { born: args.setBornTo }, { new: true });
      } catch (error) {
        //console.log(error);
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }

      // generate bookCount field for the author
      const bookCount = await Book.find({ author: author._id });
      author.bookCount = bookCount.length;

      return author;
    },
    createUser: async (parent, args) => {
      const user = new User({ ...args });

      let retUser;
      try {
        retUser = user.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }
      return retUser;
    },
    login: async (parent, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== 'secret') {
        throw new UserInputError('wrong credentials');
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, JWT_SECRET) };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET);
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
  },
});

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`);
  console.log(`Subscriptions ready at ${subscriptionsUrl}`);
});
