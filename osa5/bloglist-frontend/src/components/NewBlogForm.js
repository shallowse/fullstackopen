import React, { useState } from 'react';

const NewBlogForm = ({
  handleSubmit = f => f,
  notifyUser = f => f,
}) => {
  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [newBlogAuthor, setNewBlogAuthor] = useState('');
  const [newBlogUrl, setNewBlogUrl] = useState('');

  const handleNewBlog = (event) => {
    event.preventDefault();
    if (!(newBlogTitle && newBlogAuthor && newBlogUrl)) {
      notifyUser('some fields are missing content.');
      return;
    }

    const newBlog = {
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl,
    };

    handleSubmit(newBlog);

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
    </div>
  );
};


export default NewBlogForm;
