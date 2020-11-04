import React, { useState, useEffect } from 'react';
import Blog from './components/Blog';
import Notification from './components/Notification';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [newBlogAuthor, setNewBlogAuthor] = useState('');
  const [newBlogUrl, setNewBlogUrl] = useState('');

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
  }

  return (
    <>
      <Notification message={errorMessage} />

      <div>
        {user === null ?
          <>
            <h2>Log in to application</h2>
            <form onSubmit={handleLogin}>
              <div>
                username:{' '}
                <input
                  type='text'
                  value={username}
                  name='username'
                  onChange={({ target }) => setUsername(target.value)}
                />
              </div>
              <div>
                password:{' '}
                <input
                  type='password'
                  value={password}
                  name='password'
                  onChange={({ target }) => setPassword(target.value)}
                />
              </div>
              <button type='submit'>login</button>
            </form>
          </>
          :
          <div>
            {user.name} logged in{' '}
            <button onClick={handleLogout}>logout</button>
          </div>
        }
      </div>

      <div>
        {user !== null &&
          <>
            <h2>create new</h2>
            <form onSubmit={handleNewBlog}>
              <div>
                title:{' '}
                <input
                  type='text'
                  value={newBlogTitle}
                  onChange={({ target }) => setNewBlogTitle(target.value)}
                />
              </div>

              <div>
                author:{' '}
                <input
                  type='text'
                  value={newBlogAuthor}
                  onChange={({ target }) => setNewBlogAuthor(target.value)}
                />
              </div>

              <div>
                url:{' '}
                <input
                  type='text'
                  value={newBlogUrl}
                  onChange={({ target }) => setNewBlogUrl(target.value)}
                />
              </div>
              <button type='submit'>create</button>
            </form>
          </>
        }
      </div>

      {
        user !== null &&
        <div>
          <h2>Blogs</h2>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </div>
      }
    </>
  );
};

export default App;
