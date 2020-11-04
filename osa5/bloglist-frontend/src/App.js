import React, { useState, useEffect, useRef } from 'react';
import BlogList from './components/BlogList';
import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
import NewBlogForm from './components/NewBlogForm';
import blogService from './services/blogs';
import loginService from './services/login';
import Togglable from './components/Togglable';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const newBlogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const notifyUser = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
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

  // POST
  const handleNewBlog = async (newBlog) => {
    newBlogFormRef.current.toggleVisibility();
    try {
      const response = await blogService.postNewBlog(newBlog);
      setBlogs(blogs.concat(response));
      notifyUser(`Added ${response.title}`);
    } catch (error) {
      console.log(error.response.data.error);
      notifyUser(`Error while posting (POST) new blog to the server: ${error.response.data.error}`)
    }
  }

  // PUT
  const handleUpdateLike = async (updateBlogId, updateBlog) => {
    try {
      const response = await blogService.updateBlog(updateBlogId, updateBlog);
      //console.log('RESPONSE ::', response);
      setBlogs(blogs.map(blog => blog.id !== updateBlogId ? blog : response));
      notifyUser(`Updated ${response.title}`);
    } catch (error) {
      notifyUser(`Error while updating (PUT) blog to the server: ${error.response.data.error}`)
    }
  };

  // DELETE
  const handleDeleteBlog = async (deleteBlog) => {
    //console.log(deleteBlog);
    try {
      await blogService.deleteBlog(deleteBlog.id);
      setBlogs(blogs.filter(blog => blog.id !== deleteBlog.id));
      notifyUser(`Deleted ${deleteBlog.title}`);
    } catch (error) {
      notifyUser(`Error while deleting (DELETE) blog from the server: ${error.response.data.error}`)
    }
  };

  if (user === null) {
    return <LoginForm handleSubmit={handleLogin} />
  }

  return (
    <>
      <h2>Blogs</h2>
      <Notification message={errorMessage} />

      <div>
        {user.name} logged in{' '}
        <button onClick={handleLogout}>logout</button>
      </div>

      <br />

      <Togglable buttonLabel='new note' ref={newBlogFormRef}>
        <NewBlogForm
          handleSubmit={handleNewBlog}
          notifyUser={notifyUser}
        />
      </Togglable>

      <br />

      <BlogList
        blogs={blogs}
        handleUpdateLike={handleUpdateLike}
        handleDeleteBlog={handleDeleteBlog}
      />
    </>
  );
};

export default App;
