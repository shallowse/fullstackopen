import React from 'react';
import { connect } from 'react-redux';
import { createNewAnecdote } from '../reducers/anecdoteReducer';
import { setNotification } from '../reducers/notificationReducer';

const AnecdoteForm = (props) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    if (content === '') {
      return;
    }
    event.target.anecdote.value = '';
    props.createNewAnecdote(content);
    props.setNotification(`you created '${content}'`, 5);
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

const mapDispatchToProps = {
  createNewAnecdote,
  setNotification,
};

const ConnectedForm = connect(
  null,
  mapDispatchToProps
)(AnecdoteForm);

export default ConnectedForm;
