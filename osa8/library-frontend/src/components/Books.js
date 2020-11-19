import React, { useState } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';
import { GET_ALL_BOOKS, GET_ALL_GENRES_BOOKS, GET_GENRE_BOOKS } from '../queries/queries';

const Books = (props) => {
  if (!props.show) {
    return null;
  }

  // state: {'all genres', '<genrename 1>',...,'<genrename N>'}
  const [state, setState] = useState('all genres');
  const resultAllBooks = useQuery(GET_ALL_BOOKS);
  const resultAllGenres = useQuery(GET_ALL_GENRES_BOOKS);

  // https://www.apollographql.com/docs/react/api/react/hooks/#uselazyquery
  const [loadSelectedGenre, { loading: selected_genre_loading, data: selected_genre_data }] = useLazyQuery(
    GET_GENRE_BOOKS,
    {
      variables: { genre: state },
      onError: (error) => {
        console.log(error);
      }
    },
  );

  const showGenre = (genre) => {
    setState(genre);
    loadSelectedGenre(genre);
  };

  if (resultAllBooks.loading || resultAllGenres.loading || selected_genre_loading) {
    return <p>Loading ...</p>;
  }

  if (resultAllBooks.error) {
    return <p>Error: {resultAllBooks.error}</p>;
  }

  if (resultAllGenres.error) {
    return <p>Error: {resultAllGenres.error}</p>;
  }

  let genres = ['all genres'];
  genres = [...resultAllGenres.data.allGenres, ...genres];

  let booksToShow = resultAllBooks.data.allBooks;
  if (state !== 'all genres' && selected_genre_data) {
    booksToShow = selected_genre_data.allBooks;
    booksToShow = booksToShow.filter(S => S.genres.includes(state));
  }

  //console.log(booksToShow);

  return (
    <div>
      <h2>books</h2>

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
          {booksToShow.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>

      {
        genres.map(S =>
          <button key={S} onClick={() => showGenre(S)}>{S}</button>
        )
      }
    </div >
  );
};

export default Books;
