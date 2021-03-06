import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';

const User = ({ match }) => {
  const { userId } = match.params;
  const user = useSelector(state => state.users.users.find(n => n.id === userId));

  if (!user) {
    return <h1>TODO: User data has not been loaded?</h1>;
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ListGroup>
        {
          user.blogs.map(blog =>
            <ListGroup.Item key={blog.id}>
              <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
            </ListGroup.Item>
          )
        }
      </ListGroup>
    </div>
  );
};

export default User;
