import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

import { notificationAdded } from './reducers/notificationSlice';

import BlogList from './components/BlogList';
import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
import NewBlogForm from './components/NewBlogForm';
import blogService from './services/blogs';
import loginService from './services/login';
import Togglable from './components/Togglable';

const App = () => {
  const [user, setUser] = useState(null);

  const newBlogFormRef = useRef();

  const dispatch = useDispatch();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const notifyUser = (message) => {
    dispatch(notificationAdded(message));
    setTimeout(() => {
      dispatch(notificationAdded(''));
    }, 5000);
  };

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user));
      setUser(user);
      blogService.setToken(user.token);
    } catch (error) {
      notifyUser('wrong username or password');
      console.log(error);
    }
  };

  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem('loggedBlogAppUser');
    blogService.setToken(null);
  };

  if (user === null) {
    return (
      <section>
        <Notification />
        <LoginForm handleSubmit={handleLogin} />
      </section>
    );
  }

  return (
    <section>
      <h2>Blogs</h2>
      <Notification />

      <div>
        {user.name} logged in{' '}
        <button onClick={handleLogout}>logout</button>
      </div>

      <br />

      <Togglable buttonLabel='new note' ref={newBlogFormRef}>
        <NewBlogForm />
      </Togglable>

      <br />

      <BlogList />
    </section>
  );
};

export default App;
