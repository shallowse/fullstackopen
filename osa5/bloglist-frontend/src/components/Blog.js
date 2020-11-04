import React, { useState } from 'react'

const Blog = ({
  blog = {},
  handleUpdateLike = f => f,
}) => {
  const [showAll, setShowAll] = useState(false);

  const blogStyle = {
    paddingTop: '10px',
    paddingLeft: '2px',
    border: 'solid',
    borderWidth: '1px',
    marginBottom: '5px',
  };

  const handleLike = async (blogTarget) => {
    //console.log(blogTarget);
    const blogUpdate = {
      likes: blogTarget.likes + 1,
      title: blogTarget.title,
      author: blogTarget.author,
      url: blogTarget.url,
      user: blogTarget.user.id,
    }
    handleUpdateLike(blogTarget.id, blogUpdate);
  };

  if (showAll) {
    return (
      <div style={blogStyle}>
        {blog.title} {blog.author}{' ' }
        <button onClick={() => setShowAll(!showAll)}>hide</button><br />
        {blog.url}<br />
        likes{' '}{blog.likes}{' '}<button onClick={() => handleLike(blog)}>like</button><br />
        {blog.user.name}{' '}
      </div>
    );
  } else {
    return (
      <div style={blogStyle}>
        {blog.title} {blog.author}{' '}
        <button onClick={() => setShowAll(!showAll)}>view</button>
      </div>
    );
  }
};

export default Blog;
