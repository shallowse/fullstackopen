import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';

const App = () => {
  /*
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ]);
  */
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filterByName, setFilterByName] = useState('');

  useEffect(() => {
    // TBD: add localhost to URL
    axios.get('http://192.168.0.23:3001/persons')
      .then(response => {
        console.log('promise fullfilled', response);
        setPersons(response.data);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    //console.log('name', newName === '');
    if (newName === '' || newNumber === '') {
      return;
    }

    if (persons.find(x => x.name === newName) !== undefined) {
      alert(`${newName} is already added to phonebook`);
      return;
    }

    const newPerson = {
      name: newName,
      number: newNumber,
    };

    setPersons(persons.concat(newPerson));
    setNewName('');
    setNewNumber('');
  };

  const handleNameChange = (event) => {
    //console.log(event.target.value);
    setNewName(event.target.value);
  };

  const handleNewNumber = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterByName = (event) => {
    setFilterByName(event.target.value);
  };

  const personsToShow = filterByName === ''
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(filterByName.toLowerCase()));

  //console.log(personsToShow);

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter
        filterByName={filterByName}
        handleFilterByName={handleFilterByName}
      />

      <h3>Add a new</h3>

      <PersonForm
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNewNumber={handleNewNumber}
        handleSubmit={handleSubmit}
      />

      <h3>Numbers</h3>

      <Persons personsToShow={personsToShow} />
    </div>
  );
};

export default App;
