import React, { useState, useEffect } from 'react';
import axios from 'axios';

const useField = (type) => {
  const [value, setValue] = useState('');

  const onChange = (event) => {
    setValue(event.target.value);
  };

  const reset = () => {
    setValue('');
  };

  return {
    type,
    value,
    onChange,
    reset,
  };
};

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([]);

  const getAll = async () => {
    const request = await axios.get(baseUrl);
    //console.log(request.data);
    setResources(request.data);
  };

  const create = async (resource) => {
    const response = await axios.post(baseUrl, resource);
    //console.log(response.data);
    setResources([...resources, response.data]);
  };

  const service = {
    getAll,
    create
  };

  return [
    resources, service
  ];
};

const App = () => {
  const { reset: contentReset, ...content } = useField('text');
  const { reset: nameReset, ...name } = useField('text');
  const { reset: numberReset, ...number } = useField('text');

  const [notes, noteService] = useResource('http://localhost:3005/notes');
  const [persons, personService] = useResource('http://localhost:3005/persons');

  useEffect(() => {
    noteService.getAll();
    personService.getAll();
  }, []);

  const handleNoteSubmit = (event) => {
    event.preventDefault();
    noteService.create({ content: content.value });
    contentReset();
  };

  const handlePersonSubmit = (event) => {
    event.preventDefault();
    personService.create({ name: name.value, number: number.value });
    nameReset();
    numberReset();
  };

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...content} />{' '}
        <button>create</button>
      </form>
      {notes.map(n => <p key={n.id}>{n.content}</p>)}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name{' '}<input {...name} /> <br />
        number{' '}<input {...number} />
        <button>create</button>
      </form>
      {persons.map(n => <p key={n.id}>{n.name} {n.number}</p>)}
    </div>
  );
};

export default App;
