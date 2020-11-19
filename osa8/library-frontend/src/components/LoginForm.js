import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';

import { LOGIN } from '../queries/queries';

const LoginForm = (props) => {
  if (!props.show) {
    return null;
  }

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [login, { data }] = useMutation(LOGIN, {
    onError: (error) => {
      props.setError(String(error));
    },
  });

  useEffect(() => {
    if (data) {
      //console.log('data', data);
      const token = data.login.value;
      props.setToken(token);
      localStorage.setItem('token', token);
      props.setPage('authors');
    }
  }, [data]);

  const submitLogin = async (event) => {
    event.preventDefault();
    login({ variables: { username, password } });
  };

  return (
    <div style={{ marginTop: '10px' }}>
      <form onSubmit={submitLogin}>
        <div>
          username:{' '}
          <input value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          password:{' '}
          <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  );
};

export default LoginForm;
