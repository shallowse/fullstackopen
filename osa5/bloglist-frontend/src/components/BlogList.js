import React from 'react';
import Blog from './Blog';

const BlogList = ({
  blogs = [],
  handleUpdateLike = f => f,
}) => {
  return (
    <div>
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          handleUpdateLike={handleUpdateLike}
        />
      )}
    </div>
  );
};

export default BlogList;
