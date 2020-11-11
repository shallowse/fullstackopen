import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { loginUser, resetFailedLoginUser } from '../reducers/loginUserSlice';
import { notificationAdded } from '../reducers/notificationSlice';

import { Form, Col, Row, Button } from 'react-bootstrap';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const loginStatus = useSelector(state => state.login.status);
  const error = useSelector(state => state.login.error);

  const dispatch = useDispatch();

  useEffect(() => {
    if (loginStatus === 'failed') {
      console.log(error);
      dispatch(notificationAdded('wrong username or password'));
      dispatch(resetFailedLoginUser());
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
      <Form onSubmit={handleLogin}>
        <Form.Group as={Row} >
          <Form.Label column sm={2}>
            username:
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type='text'
              placeholder='Your username'
              value={username}
              id='username'
              onChange={({ target }) => setUsername(target.value)}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} >
          <Form.Label column sm={2}>
            password:
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type='password'
              placeholder='Your password'
              value={password}
              id='password'
              onChange={({ target }) => setPassword(target.value)}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Col sm={{ span: 10, offset: 2 }}>
            <Button id='loginButton' type='submit'>login</Button>
          </Col>
        </Form.Group>
      </Form>
    </div>
  );
};

export default LoginForm;
