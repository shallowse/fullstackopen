import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';

import { updateBlogs, deleteBlogs, postBlogsComment } from '../reducers/blogsSlice';

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

const Blog = ({ match }) => {
  const [blogComment, setBlogComment] = useState('');
  const history = useHistory();

  const { blogId } = match.params;
  const blog = useSelector(state => state.blogs.blogs.find(n => n.id === blogId));

  const dispatch = useDispatch();

  const handleLike = (blogTarget) => {
    const blogUpdate = {
      likes: blogTarget.likes + 1,
      title: blogTarget.title,
      author: blogTarget.author,
      url: blogTarget.url,
      user: blogTarget.user.id,
    };

    dispatch(updateBlogs({ id: blogTarget.id, blog: blogUpdate }));
  };

  const handleRemove = (blogTarget) => {
    const confirmDelete = window.confirm(`Remove blog ${blogTarget.title} by ${blogTarget.user.name}?`);
    if (!confirmDelete) {
      return;
    }
    dispatch(deleteBlogs(blogTarget));
    history.push('/');
  };

  const handleAddComment = (blogTarget) => {
    dispatch(postBlogsComment({ id: blogTarget.id, comment: blogComment }));
    setBlogComment('');
  };

  if (!blog) {
    return <h1>TODO: Maybe blogs have not been loaded?</h1>;
  }

  return (
    <div className='blogEntry' style={blogStyle}>
      <h2>{blog.title} {blog.author}</h2>
      <p><Link to={blog.url}>{blog.url}</Link></p>
      <p>
        likes{' '}{blog.likes}{' '}
        <button className='likeButton' onClick={() => handleLike(blog)}>like</button>
      </p>
      <p>added by {blog.user.name}</p>
      <h4>comments</h4>
      <input
        type='text'
        name='commentInput'
        id='commentInput'
        placeholder='add comment...'
        value={blogComment}
        onChange={(e) => setBlogComment(e.target.value)}
      />
      {' '}<button onClick={() => handleAddComment(blog)}>add comment</button>
      <ul>
        {blog.comments.map(c => <li key={c.id}>{c.content}</li>)}
      </ul>
      <button style={removeButtonStyle} onClick={() => handleRemove(blog)}>remove</button>
    </div>
  );
};

export default Blog;
