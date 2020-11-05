import React from 'react';

const notificationStyle = {
  border: '2px solid blue',
  backgroundColor: 'lightgray',
  fontSize: '2rem',
  color: 'white',
  padding: '5px',
};

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  return (
    <div className='error' style={notificationStyle}>
      {message}
    </div>
  );
};

export default Notification;
