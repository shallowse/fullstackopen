import React from 'react';

const NewBlogForm = ({
  newBlogTitle = '',
  newBlogAuthor = '',
  newBlogUrl = '',
  handleSetNewBlogTitle = f => f,
  handleSetNewBlogAuthor = f => f,
  handleSetNewBlogUrl = f => f,
  handleSubmit = f => f,
}) => {
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          title:{' '}
          <input
            type='text'
            value={newBlogTitle}
            onChange={handleSetNewBlogTitle}
          />
        </div>

        <div>
          author:{' '}
          <input
            type='text'
            value={newBlogAuthor}
            onChange={handleSetNewBlogAuthor}
          />
        </div>

        <div>
          url:{' '}
          <input
            type='text'
            value={newBlogUrl}
            onChange={handleSetNewBlogUrl}
          />
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  );
};

export default NewBlogForm;
