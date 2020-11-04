import React from 'react';

const LoginForm = ({
  username = '',
  password = '',
  handleSetUsername = f => f,
  handleSetPassword = f => f,
  handleSubmit = f => f,
}) => {
  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleSubmit}>
        <div>
          username:{' '}
          <input
            type='text'
            value={username}
            name='username'
            onChange={handleSetUsername}
          />
        </div>
        <div>
          password:{' '}
          <input
            type='password'
            value={password}
            name='password'
            onChange={handleSetPassword}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  );
};

export default LoginForm;
