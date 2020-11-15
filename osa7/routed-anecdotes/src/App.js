import React, { useState } from 'react';
import {
  Switch,
  Route,
  Link,
  useRouteMatch,
  useHistory,
} from 'react-router-dom';
import { useField } from './hooks';

const Anecdote = ({ anecdote }) => {
  return (
    <div>
      <h2>{anecdote.content}</h2>
      has{' '}{anecdote.votes}{' '}votes<br /><br />
      for more info see{' '}{anecdote.info}
    </div>
  );
};

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote =>
        <li key={anecdote.id}>
          <Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
        </li>
      )}
    </ul>
  </div>
);

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>
    <em>An anecdote is a brief, revealing account of an individual person or an incident.
    Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke
    laughter but to reveal a truth more general than the brief tale itself,
    such as to characterize a person by delineating a specific quirk or trait,
    to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
    An anecdote is &quot;a story with a point.&quot;</em>
    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
);

const Footer = () => {
  const style = {
    border: '4px solid red',
    padding: '16px',
    marginTop: '16px',
  };

  return (
    <div style={style}>
      Anecdote app for <a href='https://courses.helsinki.fi/fi/tkt21009'>Full Stack -websovelluskehitys</a>.
    See < a href='https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js' >
        https://github.com/fullstack-hy2019/routed-anecdotes/blob/master/src/App.js</a> for the source code.
    </div >
  );
};

const CreateNew = (props) => {
  // Renaming fields for object destructuring
  // https://flaviocopes.com/how-to-rename-object-destructuring/
  const { reset: contentReset, ...content } = useField('text');
  const { reset: authorReset, ...author } = useField('text');
  const { reset: infoReset, ...info } = useField('text');

  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.value === '' || author.value === '' || info.value === '') {
      return;
    }
    props.addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    });
    history.push('/');
  };

  const handleReset = (e) => {
    e.preventDefault();
    contentReset();
    authorReset();
    infoReset();
  };

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content{' '}
          <input name='content' {...content} />
        </div>
        <div>
          author{' '}
          <input name='author' {...author} />
        </div>
        <div>
          url for more info{' '}
          <input name='info' {...info} />
        </div>
        <button>create</button>{' '}<button onClick={handleReset}>reset</button>
      </form>
    </div>
  );
};

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: '1'
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: '2'
    }
  ]);

  const [notification, setNotification] = useState('');

  const match = useRouteMatch('/anecdotes/:id');
  let anecdote = match
    ? anecdotes.find(a => Number(a.id) === Number(match.params.id))
    : null;
  // Was the given :id valid? if not, then we inform the user
  if (anecdote === undefined) {
    anecdote = {
      content: 'A nonvalid anecdote :id path was given',
      votes: 0,
      info: 'ERROR'
    };
  }

  const addNew = (anecdote) => {
    anecdote.id = (Math.random() * 10000).toFixed(0);
    setAnecdotes(anecdotes.concat(anecdote));
    setNotification(`a new anecdote ${anecdote.content} created!`);
    setTimeout(() => {
      setNotification('');
    }, 10 * 1000);
  };

  /*

  const anecdoteById = (id) => anecdotes.find(a => a.id === id);

  const vote = (id) => {
    const anecdote = anecdoteById(id);

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    };

    setAnecdotes(anecdotes.map(a => a.id === id ? voted : a));
  };
  */

  const padding = {
    paddingRight: '5px',
  };

  return (
    <div>
      <h1>Software anecdotes</h1>
      <div>
        <Link style={padding} to='/anecdotes'>anecdotes</Link>
        <Link style={padding} to='/create'>create new</Link>
        <Link style={padding} to='/about'>about</Link>
      </div>

      {notification &&
        <div style={{ border: '2px solid red', padding: '8px' }}>
          {notification}
        </div>
      }

      <Switch>
        <Route exact path='/anecdotes/:id'>
          <Anecdote anecdote={anecdote} />
        </Route>
        <Route exact path='/anecdotes'>
          <AnecdoteList anecdotes={anecdotes} />
        </Route>
        <Route exact path='/create'>
          <CreateNew addNew={addNew} />
        </Route>
        <Route exact path='/about'>
          <About />
        </Route>
      </Switch>

      <Route exact path='/'>
        <AnecdoteList anecdotes={anecdotes} />
      </Route>
      <Footer />
    </div >
  );
};

export default App;
