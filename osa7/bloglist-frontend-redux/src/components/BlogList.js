import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { getBlogs } from '../reducers/blogsSlice';
import { notificationAdded } from '../reducers/notificationSlice';

const blogStyle = {
  paddingTop: '10px',
  paddingLeft: '2px',
  paddingBottom: '5px',
  border: 'solid',
  borderWidth: '1px',
  marginBottom: '5px',
};

const BlogList = () => {
  const dispatch = useDispatch();
  const blogs = useSelector(state => state.blogs.blogs);

  const blogsStatus = useSelector(state => state.blogs.status);
  const error = useSelector(state => state.blogs.error);

  useEffect(() => {
    if (blogsStatus === 'idle') {
      dispatch(getBlogs());
    } else if (blogsStatus === 'failed') {
      dispatch(notificationAdded(error));
      setTimeout(() => {
        dispatch(notificationAdded(''));
      }, 5000);
    }
  }, [blogsStatus, error, dispatch]);

  let content = null;

  if (blogsStatus === 'loading') {
    content = <div>Loading ...</div>;
  } else if (blogsStatus === 'succeeded') {
    const sortedBlogs = blogs.slice().sort((a, b) => Number(b.likes) - Number(a.likes));
    content =
      (<div className='blogList'>
        {sortedBlogs.map(blog =>
          <div className='blogEntry' style={blogStyle} key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>
              {blog.title} {blog.author}{' '}
            </Link>
          </div>
        )}
      </div>);
  } else if (blogsStatus === 'failed') {
    content = <h3>Please reload and try again...</h3>;
  }

  return (
    <section>
      {content}
    </section>
  );
};

export default BlogList;
