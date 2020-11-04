import React, { useState } from 'react'

const Blog = ({ blog }) => {
  const [showAll, setShowAll] = useState(false);

  const blogStyle = {
    paddingTop: '10px',
    paddingLeft: '2px',
    border: 'solid',
    borderWidth: '1px',
    marginBottom: '5px',
  };

  if (showAll) {
    return (
      <div style={blogStyle}>
        {blog.title} {blog.author}{' ' }
        <button onClick={() => setShowAll(!showAll)}>hide</button><br />
        {blog.url}<br />
        likes{' '}{blog.likes}{' '}<button>like</button><br />
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
