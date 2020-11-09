import React from 'react';
import { connect } from 'react-redux';
import { voteAnecdote } from '../reducers/anecdoteReducer';
import { setNotification } from '../reducers/notificationReducer';

const Anecdotes = (props) => {
  const handleClick = (anecdote) => {
    props.voteAnecdote(anecdote);
    props.setNotification(`you voted '${anecdote.content}'`, 5);
  };

  // https://redux.js.org/tutorials/essentials/part-4-using-data
  const sortedAnecdotes = props.anecdotes.slice().sort((a, b) => Number(b.votes) - Number(a.votes));

  return (
    <div>
      {
        sortedAnecdotes.map(anecdote =>
          <div key={anecdote.id} style={{ marginTop: '5px' }}>
            <div>
              {anecdote.content}
            </div>
            <div>
              has {anecdote.votes}{' '}
              <button onClick={() => handleClick(anecdote)}>vote</button>
            </div>
          </div>
        )
      }
    </div >
  );
};

const mapStateToPros = (state) => {
  if (state.filter === '') {
    return {
      anecdotes: state.anecdotes,
    };
  }
  return {
    anecdotes: state.anecdotes.filter(n => n.content.toLowerCase().includes(state.filter.toLowerCase()))
  };
};

const mapDispatchToProps = {
  voteAnecdote,
  setNotification,
};

const ConnectedAnecdotes = connect(
  mapStateToPros,
  mapDispatchToProps
)(Anecdotes);

export default ConnectedAnecdotes;
