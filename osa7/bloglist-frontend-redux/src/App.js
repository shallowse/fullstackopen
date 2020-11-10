import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

//import { notificationAdded } from './reducers/notificationSlice';
import { setUser, logoutUser } from './reducers/userSlice';

import BlogList from './components/BlogList';
import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
import NewBlogForm from './components/NewBlogForm';
import Togglable from './components/Togglable';

const App = () => {
  const user = useSelector(state => state.user.user);

  const newBlogFormRef = useRef();

  const dispatch = useDispatch();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setUser(user));
    }
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  if (user === null) {
    return (
      <section>
        <Notification />
        <LoginForm />
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
