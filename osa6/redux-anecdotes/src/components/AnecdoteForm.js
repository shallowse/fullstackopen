import React from 'react';
import { useDispatch } from 'react-redux';
import { createNewAnecdote } from '../reducers/anecdoteReducer';

const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const handleSubmit = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    if (content === '') {
      return;
    }
    event.target.anecdote.value = '';
    dispatch(createNewAnecdote(content));
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <input name='anecdote' />{' '}
        <button type='submit'>create</button>
      </form>
    </div>
  );
};
export default AnecdoteForm;
