import React from 'react';
import { useSelector } from 'react-redux';

const notificationStyle = {
  border: '2px solid blue',
  backgroundColor: 'lightgray',
  fontSize: '2rem',
  color: 'white',
  padding: '5px',
};

const Notification = () => {
  const { message }  = useSelector(state => state.notification);

  if (message === '') {
    return null;
  }

  return (
    <div className='error' style={notificationStyle}>
      {message}
    </div>
  );
};

export default Notification;
