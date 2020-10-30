import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const App = (props) => {
  const [selected, setSelected] = useState(0);
  const [points, setPoints] = useState(new Array(anecdotes.length).fill(0));

  // https://stackoverflow.com/questions/11301438/return-index-of-greatest-value-in-an-array/51523641#51523641
  let mostVotesIdx = points.indexOf(Math.max(...points));

  const handleSelection = () => {
    const randNum = Math.floor(Math.random() * anecdotes.length);
    //console.log(randNum);
    setSelected(randNum);
  };

  const handleVote = () => {
    const copy = [...points];
    copy[selected] += 1;
    console.log(copy);
    setPoints(copy);
  };

  return (
    <div>
      <h2>Anecdote of the day</h2>
      {props.anecdotes[selected]}
      <br />
      has {points[selected]} votes
      <br />
      <button onClick={handleVote} style={{ marginRight: '10px' }}>vote</button>
      <button onClick={handleSelection}>next anecdote</button>

      <h2>Anecdote with most votes</h2>
      {props.anecdotes[mostVotesIdx]}
      <br />
      has {points[mostVotesIdx]}
    </div>
  );
};

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
];

//const points = new Array(anecdotes.length).fill(0);

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
);
