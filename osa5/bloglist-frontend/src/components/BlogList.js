import React from 'react';
import Blog from './Blog';

const BlogList = ({
  blogs = [],
  handleUpdateLike = f => f,
}) => {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
  const sortedBlogs = blogs.sort((a, b) => Number(b.likes) - Number(a.likes));
  return (
    <div>
      {sortedBlogs.map(blog =>
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
