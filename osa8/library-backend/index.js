const { ApolloServer, UserInputError, gql,/*, AuthenticationError */ } = require('apollo-server');
require('dotenv').config();

const mongoose = require('mongoose');
const Book = require('./models/book');
const Author = require('./models/author');

const MONGODB_URI = process.env.MONGODB_URI;
//const JWT_SECRET = process.env.SECRET;

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

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
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
  }
`;

const resolvers = {
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
  },
  Author: {
    bookCount: async (parent) => {
      // Generate bookCount field for the author
      // 1. find the Object id of the author
      // 2. find the books of the author using the obtained id
      //console.log(parent);
      const author = await Author.findOne({ name: parent.name });
      if (!author) {
        return null;
      }
      const bookCount = await Book.find({ author: author._id });
      return bookCount.length;
    },
  },
  Mutation: {
    addBook: async (parent, args) => {
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

      return book;
    },
    editAuthor: async (parent, args) => {
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
        author = await Author.findOneAndUpdate({ _id: authorFound._id }, { born: args.setBornTo });
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
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
