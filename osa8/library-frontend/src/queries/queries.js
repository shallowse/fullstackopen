import { gql } from '@apollo/client';

export const GET_ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      id
      born
      bookCount
    }
  }
`;

export const GET_ALL_BOOKS = gql`
  query {
    allBooks {
      title
      author {
        name
        born
        bookCount
      }
      published
      genres
    }
  }
`;

export const GET_GENRE_BOOKS = gql`
  query GetGenreBooks($genre: String!) {
    allBooks(genre: $genre) {
      title
      author {
        name
        born
        bookCount
      }
      published
    }
  }
`;

export const GET_ALL_GENRES_BOOKS = gql`
  query {
    allGenres
  }
`;

export const GET_ME = gql`
  query {
    me {
      favoriteGenre
    }
  }
`;

export const CREATE_BOOK = gql`
  mutation createBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      title
    }
  }
`;

export const UPDATE_AUTHOR_BORN = gql`
  mutation updateAuthorBorn(
    $name: String!
    $setBornTo: Int!
  ) {
    editAuthor(
      name: $name
      setBornTo: $setBornTo
    ) {
      name
      born
    }
  }
`;

export const LOGIN = gql`
  mutation login(
   $username: String!
   $password: String!
  ) {
    login(
      username: $username
      password: $password
    ) {
      value
    }
  }
`;
