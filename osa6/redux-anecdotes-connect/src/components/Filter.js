import React from 'react';
import { filterChange } from '../reducers/filterReducer';
import { connect } from 'react-redux';

const Filter = (props) => {

  const handleChange = (event) => {
    //console.log(event.target.value);
    props.filterChange(event.target.value);
  };

  const style = {
    marginBottom: '16px',
  };

  return (
    <div style={style}>
      filter{' '}<input onChange={handleChange} />
    </div>
  );
};

const mapDispatchToProps = {
  filterChange,
};

const ConnectedFilter = connect(
  null,
  mapDispatchToProps
)(Filter);

export default ConnectedFilter;
