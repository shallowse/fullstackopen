import React from 'react';

const Persons = ({
  personsToShow = [],
  handlePersonDelete = f => f,
}) => {
  return (
    <>
      {
        personsToShow.map(person =>
          <p key={person.name}>
            {person.name} {person.number} {' '}
            <button onClick={() => handlePersonDelete(person)}>delete</button>
          </p>)
      }
    </>
  );
};

export default Persons;
