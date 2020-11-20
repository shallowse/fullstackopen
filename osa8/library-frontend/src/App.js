import React, { useEffect, useState } from 'react';
import { useApolloClient, useSubscription } from '@apollo/client';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import Notify from './components/Notify';
import LoginForm from './components/LoginForm';
import RecommendedBook from './components/RecommendedBook';

import { BOOK_ADDED, GET_ALL_BOOKS, GET_ALL_AUTHORS } from './queries/queries';

const App = () => {
  const [token, setToken] = useState(null);
  const [page, setPage] = useState('authors');
  const [errorMessage, setErrorMessage] = useState(null);
  const client = useApolloClient();

  useEffect(() => {
    const localToken = localStorage.getItem('token');
    if (localToken) {
      setToken(localToken);
    }
  }, []);

  // https://www.apollographql.com/docs/react/data/subscriptions/#options
  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const bookAdded = subscriptionData.data.bookAdded;
      //console.log(bookAdded);
      updateCacheWith(bookAdded);
      window.alert(`New book added: ${bookAdded.title} by ${bookAdded.author.name}`);
    },
  });

  // TODO: Maybe refactor the duplicate code used for updating the cache entries
  //       for books and authors.
  const updateCacheWith = (bookAdded) => {
    // console.log(bookAdded);
    // UPDATE books listing
    let dataInStore;
    try {
      dataInStore = client.readQuery({ query: GET_ALL_BOOKS });
      //console.log('update books listing cache\n', dataInStore);

      if (!dataInStore.allBooks.map(p => p.title).includes(bookAdded.title)) {
        client.writeQuery({
          query: GET_ALL_BOOKS,
          data: { allBooks: dataInStore.allBooks.concat(bookAdded) },
        });
      }
    } catch (error) {
      // Maybe the user has not yet loaded all the books by pressing the 'books' button?
      console.log(error);
    }

    // UPDATE authors listing
    try {
      dataInStore = client.readQuery({ query: GET_ALL_AUTHORS });
      //console.log('update authors listing cache\n', dataInStore);

      if (!dataInStore.allAuthors.map(p => p.name).includes(bookAdded.author.name)) {
        client.writeQuery({
          query: GET_ALL_AUTHORS,
          data: { allAuthors: dataInStore.allAuthors.concat(bookAdded.author) },
        });
      }
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const notify = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 10000);
  };

  const logOut = async () => {
    setToken(null);
    localStorage.clear();
    client.clearStore();

    // A Promise is returned
    // https://www.apollographql.com/docs/react/v2.5/api/apollo-client/#ApolloClient.resetStore
    await setPage('authors');
  };

  return (
    <div>

      <Notify errorMessage={errorMessage} />

      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {!token && <button onClick={() => setPage('login')}>login</button>}
        {token && <button onClick={() => setPage('add')}>add book</button>}
        {token && <button onClick={() => setPage('recommended')}>recommended</button>}
        {token && <button onClick={() => logOut()}>logout</button>}
      </div>

      <LoginForm
        show={page === 'login'}
        setToken={setToken}
        setError={notify}
        setPage={setPage}
      />

      <Authors
        show={page === 'authors'}
        setError={notify}
        token={token}
      />

      <Books
        show={page === 'books'}
      />

      <NewBook
        show={page === 'add'}
        setError={notify}
        setPage={setPage}
      />

      <RecommendedBook
        show={page === 'recommended'}
        setError={notify}
      />

    </div>
  );
};

export default App;
