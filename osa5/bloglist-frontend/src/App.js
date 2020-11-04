import React, { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
import NewBlogForm from './components/NewBlogForm';
import blogService from './services/blogs';
import loginService from './services/login';
import Togglable from './components/Togglable';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [newBlogAuthor, setNewBlogAuthor] = useState('');
  const [newBlogUrl, setNewBlogUrl] = useState('');
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

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user));
      setUser(user);
      blogService.setToken(user.token);
    } catch (error) {
      notifyUser('wrong username or password');
      console.log(error);
    }

    setUsername('');
    setPassword('');
  };

  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem('loggedBlogAppUser');
    blogService.setToken(null);
  };

  const handleNewBlog = async (event) => {
    event.preventDefault();
    if (!(newBlogTitle && newBlogAuthor && newBlogUrl)) {
      notifyUser('some fields are missing content.')
      return;
    }

    const newBlog = {
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl,
    };

    try {
      const response = await blogService.postNewBlog(newBlog);
      setBlogs(blogs.concat(response))
      notifyUser(`Added ${response.title}`)
    } catch (error) {
      console.log(error.response.data.error);
      notifyUser(`Error while posting (POST) new blog to the server: ${error.response.data.error}`)
    }

    setNewBlogTitle('');
    setNewBlogAuthor('');
    setNewBlogUrl('');
    newBlogFormRef.current.toggleVisibility();
  }

  return (
    <>
      <h2>Blogs</h2>
      <Notification message={errorMessage} />

      <div>
        {user === null ?
          <LoginForm
            username={username}
            password={password}
            handleSetUsername={({ target }) => setUsername(target.value)}
            handleSetPassword={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          :
          <div>
            {user.name} logged in{' '}
            <button onClick={handleLogout}>logout</button>
          </div>
        }
      </div>

      <br />

      <div>
        {user !== null &&
          <Togglable buttonLabel='new note' ref={newBlogFormRef}>
            <NewBlogForm
              newBlogTitle={newBlogTitle}
              newBlogAuthor={newBlogAuthor}
              newBlogUrl={newBlogUrl}
              handleSetNewBlogTitle={({ target }) => setNewBlogTitle(target.value)}
              handleSetNewBlogAuthor={({ target }) => setNewBlogAuthor(target.value)}
              handleSetNewBlogUrl={({ target }) => setNewBlogUrl(target.value)}
              handleSubmit={handleNewBlog}
            />
          </Togglable>
        }
      </div>

      <br />

      {
        user !== null &&
        <div>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </div>
      }
    </>
  );
};

export default App;
