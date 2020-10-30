import React from 'react';

const Filter = ({
  filterByName = '',
  handleFilterByName = f => f,
}) => {
  return (
    <p>
      filter shown with{' '}
      <input
        value={filterByName}
        onChange={handleFilterByName}
      />
    </p>
  );

};

export default Filter;
