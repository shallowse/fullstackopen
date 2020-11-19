import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_BOOKS, GET_ALL_GENRES_BOOKS, /*GET_GENRE_BOOKS*/ } from '../queries/queries';

const Books = (props) => {
  if (!props.show) {
    return null;
  }

  const [state, setState] = useState('allGenres'); // state: {'allGenres', 'specificGenre'}
  const [genre, SetGenre] = useState(null);
  const resultAllBooks = useQuery(GET_ALL_BOOKS);
  const resultAllGenres = useQuery(GET_ALL_GENRES_BOOKS);

  if (resultAllBooks.loading || resultAllGenres.loading) {
    return <p>Loading ...</p>;
  }

  if (resultAllBooks.error) {
    return <p>Error: {resultAllBooks.error}</p>;
  }

  if (resultAllGenres.error) {
    return <p>Error: {resultAllGenres.error}</p>;
  }

  let books = resultAllBooks.data.allBooks;
  let genres = resultAllGenres.data.allGenres;
  genres = [...genres, 'all genres'];

  const showGenre = (genre) => {
    if (genre === 'all genres') {
      setState('allGenres');
      SetGenre(null);
      return;
    }
    setState('specificGenre');
    SetGenre(genre);
  };

  if (state === 'allGenres') {
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
            {books.map(a =>
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
  } else if (state === 'specificGenre') {
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
            {books.filter(S => S.genres.includes(genre))
              .map(a =>
                <tr key={a.title}>
                  <td>{a.title}</td>
                  <td>{a.author.name}</td>
                  <td>{a.published}</td>
                </tr>
              )
            }
          </tbody>
        </table>

        {
          genres.map(S =>
            <button key={S} onClick={() => showGenre(S)}>{S}</button>
          )
        }

      </div>
    );
  }

  return <h1>Unexpected state... please debug.</h1>;
};

export default Books;
