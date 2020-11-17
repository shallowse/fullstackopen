const { ApolloServer, gql } = require('apollo-server');

// https://stackoverflow.com/a/62555064
const { v1: uuidv1 } = require('uuid');

let authors = [
  {
    name: 'Robert Martin',
    id: 'afa51ab0-344d-11e9-a414-719c6709cf3e',
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: 'afa5b6f0-344d-11e9-a414-719c6709cf3e',
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    id: 'afa5b6f1-344d-11e9-a414-719c6709cf3e',
    born: 1821
  },
  {
    name: 'Joshua Kerievsky', // birthyear not known
    id: 'afa5b6f2-344d-11e9-a414-719c6709cf3e',
  },
  {
    name: 'Sandi Metz', // birthyear not known
    id: 'afa5b6f3-344d-11e9-a414-719c6709cf3e',
  },
];

/*
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
*/

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: 'afa5b6f4-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: 'afa5b6f5-344d-11e9-a414-719c6709cf3e',
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: 'afa5de00-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: 'afa5de01-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring', 'patterns']
  },
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: 'afa5de02-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: 'afa5de03-344d-11e9-a414-719c6709cf3e',
    genres: ['classic', 'crime']
  },
  {
    title: 'The Demon ',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: 'afa5de04-344d-11e9-a414-719c6709cf3e',
    genres: ['classic', 'revolution']
  },
];

// http://spec.graphql.org/draft/
const typeDefs = gql`
  type Book {
    title: String!
    published: Int!
    author: String!
    id: ID!
    genres: [String!]!
  }

  type Author {
    name: String!
    id: ID!
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
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allBooks: (parent, args) => {
      // https://stackoverflow.com/a/32108184
      if (Object.keys(args).length === 0) {
        return books;
      }

      // Define two helper functions
      const filterByAuthor = (author) => books.filter(book => book.author === author);

      const filterByGenre = (S, arr = []) => {
        let tmpArray = arr.length !== 0 ? arr : books;
        return tmpArray.filter(book => {
          let tmp = book.genres.filter(genre => genre === S);
          return tmp.length !== 0 ? book : null;
        });
      };

      let retArray = [];
      if (args.author && args.genre) {
        retArray = filterByAuthor(args.author);
        retArray = filterByGenre(args.genre, retArray);
      } else if (args.author && !args.genre) {
        retArray = filterByAuthor(args.author);
      } else if (!args.author && args.genre) {
        retArray = filterByGenre(args.genre);
      }

      //console.log(retArray);
      return retArray;
    },
    allAuthors: () => {
      // 1. traverse all authors
      // 2. travers all books per author, collect count to return object

      const retArray = authors.slice();
      retArray.forEach(author => {
        const bookCount = books.reduce((accumulator, currentValue) => {
          if (currentValue.author === author.name) {
            return accumulator + 1;
          } else {
            return accumulator;
          }
        }, 0);
        author.bookCount = bookCount;
      });

      return retArray;
    },
  },
  Mutation: {
    addBook: (parent, args) => {
      // 1. find author, if author not in authors, add new author to authors
      // 2. add book to books
      const authorFound = authors.find(author => author.name === args.author);
      if (!authorFound) {
        const newAuthor = {
          name: args.author,
          id: uuidv1(),
          born: null,
        };
        authors = [...authors, newAuthor];
      }

      const newBook = {
        title: args.title,
        published: args.published,
        author: args.author,
        id: uuidv1(),
        genres: args.genres,
      };

      books = [...books, newBook];
      return newBook;
    },
    editAuthor: (parent, args) => {
      // 1. find author, if not found, return null
      // 2. uddate author born field
      const authorFound = authors.find(author => author.name === args.name);
      if (!authorFound) {
        return null;
      }
      authorFound.born = args.setBornTo;
      return authorFound;
    },
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  cacheControl: { // https://www.apollographql.com/docs/apollo-server/performance/caching/
    defaultMaxAge: 0,
  }
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
