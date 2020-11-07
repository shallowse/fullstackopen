import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const Notification = () => {
  const [message, setMessage] = useState(null);
  const notification = useSelector(state => state.notification);

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginTop: '16px',
  };

  useEffect(() => {
    setMessage(notification);
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  }, [notification]);

  if (!message) {
    return null;
  }

  return (
    <div style={style}>
      {message}
    </div>
  );
};

export default Notification;
