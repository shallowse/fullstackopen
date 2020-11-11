import React from 'react';
import { useSelector } from 'react-redux';
import { Toast } from 'react-bootstrap';

const Notification = () => {
  const { message }  = useSelector(state => state.notification);

  if (message === '') {
    return null;
  }

  return (
    <Toast>
      <Toast.Header closeButton={false}>
        <strong className='mr-auto'>Notification</strong>
      </Toast.Header>
      <Toast.Body>{message}</Toast.Body>
    </Toast>
  );
};

export default Notification;
