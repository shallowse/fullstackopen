
import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_AUTHORS, GET_ALL_BOOKS, UPDATE_AUTHOR_BORN } from '../queries/queries';

const Authors = (props) => {
  if (!props.show) {
    return null;
  }

  const [authorName, setAuthorName] = useState('');
  const [born, setBorn] = useState('');

  const { loading, error, data } = useQuery(GET_ALL_AUTHORS);
  const [updateAuthorBorn] = useMutation(UPDATE_AUTHOR_BORN, {
    refetchQueries: [{ query: GET_ALL_BOOKS }, { query: GET_ALL_AUTHORS }],
    onError: (error) => {
      props.setError(String(error));
    },
  });

  const submitBorn = (event) => {
    event.preventDefault();
    //console.log(authorName, born, typeof born);
    updateAuthorBorn({
      variables: { name: authorName, setBornTo: born }
    });
    setAuthorName('');
    setBorn('');
  };

  if (loading) {
    return <p>Loading ...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const authors = data.allAuthors;

  // https://redux.js.org/tutorials/essentials/part-4-using-data#adding-authors-for-posts
  const canSave = Boolean(authorName) && Boolean(born);

  // https://redux.js.org/tutorials/essentials/part-4-using-data#adding-authors-for-posts
  const authorsOptions = authors.map(author => (
    <option key={author.id} value={author.name}>
      {author.name}
    </option>
  ));

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>

      <div>
        <h2>Set birthyear</h2>
        <form onSubmit={submitBorn}>
          <div>
            name{' '}
            <select value={authorName} onChange={(e) => setAuthorName(e.target.value)}>
              <option value=''></option>
              {authorsOptions}
            </select>
          </div>
          <div>
            born{' '}
            <input
              type='number'
              value={born}
              onChange={(e) => setBorn(parseInt(e.target.value))}
            />
          </div>
          <button type='submit' disabled={!canSave}>update author</button>
        </form>
      </div>

    </div>
  );
};

export default Authors;
