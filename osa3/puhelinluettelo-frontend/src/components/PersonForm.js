import React from 'react';

const PersonForm = ({
  newName = '',
  handleNameChange = f => f,
  newNumber = '',
  handleNewNumber = f => f,
  handleSubmit = f => f,
}) => {

  return (
    <form>
      <div>
        name:{' '}
        <input
          value={newName}
          onChange={handleNameChange}
        />
      </div>
      <div>
        number:{' '}
        <input
          value={newNumber}
          onChange={handleNewNumber}
        />
      </div>
      <div>
        <button
          type="submit"
          onClick={handleSubmit}
        >
          add
           </button>
      </div>
    </form>
  );
};

export default PersonForm;
