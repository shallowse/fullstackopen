import React, { useState, useEffect } from 'react'
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import personService from './services/persons';

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

  // Get all the persons from the server to a local list
  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        //console.log('promise fullfilled', response);
        setPersons(response);
      })
      .catch(error => {
        alert(`Error while fetching (GET) person data from the server: ${error}`);
        setPersons([]);
      });
  }, []);

  // Submit the data to the server
  // Either
  //  (1) add a new person
  //  (2) update existing person's phone number
  const handleSubmit = (event) => {
    event.preventDefault();
    //console.log('name', newName === '');
    if (newName === '' || newNumber === '') {
      return;
    }


    // Update an existing person
    if (persons.find(x => x.name === newName) !== undefined) {
      const result = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`);
      if (result !== true) {
        return;
      }

      const person = persons.find(x => x.name === newName);
      const updatePerson = {
        ...person,
        number: newNumber,
      }

      personService
        .updatePerson(updatePerson)
        .then(response => {
          //console.log(response);
          // Update the local copy of persons
          const update = persons.map(person => {
            return person.id === response.id ? { ...person, number: response.number } : person;
          });
          setPersons(update);
        })
        .catch(error => alert(`Error while updating (PUT) new person data ${updatePerson.name} to the server: ${error}`));
    }
    // Add a new person
    else {
      const newPerson = {
        name: newName,
        number: newNumber,
      };
      personService
        .postPerson(newPerson)
        .then(response => {
          console.log(response);
          setPersons(persons.concat(response));
        })
        .catch(error => alert(`Error while posting (POST) new person data to the server: ${error}`));
    }

    setNewName('');
    setNewNumber('');
  };

  // Delete a person from the server
  const handlePersonDelete = (person) => {
    console.log('Delete :: person', person.name);
    const result = window.confirm(`Delete ${person.name}`);
    if (result !== true) {
      return;
    }

    personService
      .deletePerson(person.id)
      .then(response => {
        const updatedPersonList = persons.filter(x => x.id !== person.id);
        //console.log(updatedPersonList);
        setPersons(updatedPersonList);
      }
      )
      .catch(error => alert(`Error while deleting (DELETE) person (${person.name}) data from the server: ${error}`))
  }

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

      <Persons
        personsToShow={personsToShow}
        handlePersonDelete={handlePersonDelete}
      />
    </div>
  );
};

export default App;
