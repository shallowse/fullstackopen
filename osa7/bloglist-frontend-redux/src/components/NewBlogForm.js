import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { postBlogs } from '../reducers/blogsSlice';
import { notificationAdded } from '../reducers/notificationSlice';

const NewBlogForm = () => {
  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [newBlogAuthor, setNewBlogAuthor] = useState('');
  const [newBlogUrl, setNewBlogUrl] = useState('');

  const dispatch = useDispatch();

  const handleNewBlog = (event) => {
    event.preventDefault();
    if (!(newBlogTitle && newBlogAuthor && newBlogUrl)) {
      dispatch(notificationAdded('some fields are missing content.'));
      setTimeout(() => {
        dispatch(notificationAdded(''));
      }, 5000);
      return;
    }

    const newBlog = {
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl,
    };

    dispatch(postBlogs(newBlog));
    dispatch(notificationAdded(`Added ${newBlog.title}`));
    setTimeout(() => {
      dispatch(notificationAdded(''));
    }, 5000);
    setNewBlogTitle('');
    setNewBlogAuthor('');
    setNewBlogUrl('');
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleNewBlog}>
        <div>
          title:{' '}
          <input
            id='title'
            type='text'
            value={newBlogTitle}
            onChange={({ target }) => setNewBlogTitle(target.value)}
          />
        </div>

        <div>
          author:{' '}
          <input
            id='author'
            type='text'
            value={newBlogAuthor}
            onChange={({ target }) => setNewBlogAuthor(target.value)}
          />
        </div>

        <div>
          url:{' '}
          <input
            id='url'
            type='text'
            value={newBlogUrl}
            onChange={({ target }) => setNewBlogUrl(target.value)}
          />
        </div>
        <button id='createButton' type='submit'>create</button>
      </form>
    </div>
  );
};


export default NewBlogForm;
