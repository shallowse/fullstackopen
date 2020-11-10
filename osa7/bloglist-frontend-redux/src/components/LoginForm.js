import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { loginUser } from '../reducers/userSlice';
import { notificationAdded } from '../reducers/notificationSlice';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const loginStatus = useSelector(state => state.user.status);
  const error = useSelector(state => state.user.error);

  const dispatch = useDispatch();

  useEffect(() => {
    if (loginStatus === 'failed') {
      console.log(error);
      dispatch(notificationAdded('wrong username or password'));
      setTimeout(() => {
        dispatch(notificationAdded(''));
      }, 5000);
    }
  }, [loginStatus, dispatch]);


  const handleLogin = (event) => {
    event.preventDefault();
    dispatch(loginUser({ username, password }));
    setUsername('');
    setPassword('');
  };

  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username:{' '}
          <input
            type='text'
            value={username}
            id='username'
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password:{' '}
          <input
            type='password'
            value={password}
            id='password'
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button id='loginButton' type='submit'>login</button>
      </form>
    </div>
  );
};

export default LoginForm;
