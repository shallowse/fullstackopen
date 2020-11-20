import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_ME, GET_GENRE_BOOKS } from '../queries/queries';

const RecommendedBook = (props) => {
  if (!props.show) {
    return null;
  }

  // How to use multiple queries with dependent data?
  // https://github.com/apollographql/react-apollo/issues/3180#issuecomment-506291158
  // https://www.apollographql.com/docs/react/api/react/hooks/#params
  const {
    data: user_genre_data,
    loading: user_genre_loading,
    error: user_genre_error
  } = useQuery(GET_ME);

  const {
    data: books_genre_data,
    loading: books_genre_loading,
    error: books_genre_error
  } = useQuery(GET_GENRE_BOOKS, {
    fetchPolicy: 'network-only',
    skip: !user_genre_data,
    variables: {
      genre: user_genre_data && user_genre_data.me && user_genre_data.me.favoriteGenre,
    },
  });

  if (user_genre_loading || books_genre_loading) {
    return <p>Loading ...</p>;
  }

  const errorHandler = (msg, error) => {
    console.log(msg, error);
    props.setError(String(error));
  };

  if (user_genre_error) {
    errorHandler('user_genre_error', user_genre_error);
    return null;
  }

  if (books_genre_error) {
    errorHandler('books_genre_error', books_genre_error);
    return null;
  }


  //console.log(books_genre_data);
  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favorite genre <strong>{user_genre_data.me.favoriteGenre}</strong></p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books_genre_data.allBooks.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RecommendedBook;
