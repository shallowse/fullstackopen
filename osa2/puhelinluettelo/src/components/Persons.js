import React from 'react';

const Persons = ({
  personsToShow = [],
}) => {
  return (
    <>
      {
        personsToShow.map(person => <p key={person.name}>{person.name} {person.number}</p>)
      }
    </>
  );
};

export default Persons;
