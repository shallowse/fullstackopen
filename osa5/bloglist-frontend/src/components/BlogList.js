import React from 'react';
import Blog from './Blog';
import PropTypes from 'prop-types';

const BlogList = ({
  blogs = [],
  handleUpdateLike = f => f,
  handleDeleteBlog = f => f,
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
          handleDeleteBlog={handleDeleteBlog}
        />
      )}
    </div>
  );
};

BlogList.propTypes = {
  blogs: PropTypes.array.isRequired,
  handleUpdateLike: PropTypes.func.isRequired,
  handleDeleteBlog: PropTypes.func.isRequired,
};

export default BlogList;
