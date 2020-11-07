import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { voteAnecdote } from '../reducers/anecdoteReducer';

const Anecdotes = () => {
  const dispatch = useDispatch();
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    //console.log('filter', filter);
    if (filter === '') {
      return anecdotes;
    }
    return anecdotes.filter(n => n.content.toLowerCase().includes(filter.toLowerCase()));
  });

  anecdotes.sort((a, b) => Number(b.votes) - Number(a.votes));

  return (
    <div>
      {
        anecdotes.map(anecdote =>
          <div key={anecdote.id} style={{ marginTop: '5px' }}>
            <div>
              {anecdote.content}
            </div>
            <div>
              has {anecdote.votes}{' '}
              <button onClick={() => dispatch(voteAnecdote(anecdote))}>vote</button>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default Anecdotes;
