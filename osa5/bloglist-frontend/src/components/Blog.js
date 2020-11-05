import React, { useState } from 'react';

const Blog = ({
  blog = {},
  handleUpdateLike = f => f,
  handleDeleteBlog = f => f,
}) => {
  const [showAll, setShowAll] = useState(false);

  const blogStyle = {
    paddingTop: '10px',
    paddingLeft: '2px',
    paddingBottom: '5px',
    border: 'solid',
    borderWidth: '1px',
    marginBottom: '5px',
  };

  const removeButtonStyle = {
    backgroundColor: 'blue',
    color: 'white',
    borderRadius: '10px',
    borderColor: 'transparent',
  };

  const handleLike = (blogTarget) => {
    //console.log(blogTarget);
    const blogUpdate = {
      likes: blogTarget.likes + 1,
      title: blogTarget.title,
      author: blogTarget.author,
      url: blogTarget.url,
      user: blogTarget.user.id,
    };

    handleUpdateLike(blogTarget.id, blogUpdate);
  };

  const handleRemove = (blogTarget) => {
    //console.log(blogTarget);
    const confirmDelete = window.confirm(`Remove blog ${blogTarget.title} by ${blogTarget.user.name}?`);
    if (!confirmDelete) {
      return;
    }
    handleDeleteBlog(blogTarget);
  };

  if (showAll) {
    return (
      <div style={blogStyle}>
        {blog.title} {blog.author}{' '}
        <button onClick={() => setShowAll(!showAll)}>hide</button>{' '}
        <br />
        {blog.url}{' '}
        <br />
        likes{' '}{blog.likes}{' '}
        <button className='likeButton' onClick={() => handleLike(blog)}>like</button>
        <br />
        {blog.user.name}{' '}
        <br />
        <button style={removeButtonStyle} onClick={() => handleRemove(blog)}>remove</button>
      </div>
    );
  } else {
    return (
      <div style={blogStyle}>
        {blog.title} {blog.author}{' '}
        <button className='viewAllButton' onClick={() => setShowAll(!showAll)}>view</button>
      </div>
    );
  }
};

export default Blog;
