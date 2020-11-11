import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { voteAnecdote } from '../reducers/anecdoteReducer';
import { setNotification } from '../reducers/notificationReducer';

const Anecdotes = () => {
  const dispatch = useDispatch();
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    //console.log('filter', filter);
    if (filter === '') {
      return anecdotes;
    }
    return anecdotes.filter(n => n.content.toLowerCase().includes(filter.toLowerCase()));
  });

  // https://redux.js.org/tutorials/essentials/part-4-using-data#sorting-the-posts-list
  const sortedAnecdotes = anecdotes.slice().sort((a, b) => Number(b.votes) - Number(a.votes));

  const handleClick = (anecdote) => {
    dispatch(voteAnecdote(anecdote));
    dispatch(setNotification(`you voted '${anecdote.content}'`));
    setTimeout(() => {
      dispatch(setNotification(''));
    }, 5000);
  };

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

export default Anecdotes;
