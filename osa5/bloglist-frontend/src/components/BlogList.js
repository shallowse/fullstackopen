import React from 'react';
import Blog from './Blog';
import PropTypes from 'prop-types';

const BlogList = ({
  blogs = [],
  handleUpdateLike = f => f,
  handleDeleteBlog = f => f,
}) => {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
  // https://redux.js.org/tutorials/essentials/part-4-using-data
  const sortedBlogs = blogs.slice().sort((a, b) => Number(b.likes) - Number(a.likes));

  return (
    <div className='blogList'>
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
