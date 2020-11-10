import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { getUsers } from '../reducers/usersSlice';
import { notificationAdded } from '../reducers/notificationSlice';

const UserList = () => {
  const dispatch = useDispatch();
  const users = useSelector(state => state.users.users);

  const usersStatus = useSelector(state => state.users.status);
  const error = useSelector(state => state.users.error);

  useEffect(() => {
    if (usersStatus === 'idle') {
      dispatch(getUsers());
    } else if (usersStatus === 'failed') {
      dispatch(notificationAdded(error));
      setTimeout(() => {
        dispatch(notificationAdded(''));
      }, 5000);
    }
  }, [usersStatus, error, dispatch]);

  let content = null;

  if (usersStatus === 'loading') {
    content = <div>Loading users...</div>;
  } else if (usersStatus === 'succeeded') {
    const sortedUsers = users.slice().sort((a, b) => Number(b.blogs.length) - Number(a.blogs.length));
    content =
      (
        <div>
          <h2>Users</h2>
          <table>
            <thead>
              <tr>
                <th></th>
                <th><strong>blogs created</strong></th>
              </tr>
            </thead>
            <tbody>
              {
                sortedUsers.map(user =>
                  <tr key={user.id}>
                    <td><Link to={`/users/${user.id}`}>{user.name}</Link></td>
                    <td>{user.blogs.length}</td>
                  </tr>)
              }
            </tbody>
          </table>
        </div>
      );
  } else if (usersStatus === 'failed') {
    content = <h3>Please reload and try again to fetch users...</h3>;
  }

  return (
    <section>
      {content}
    </section>
  );
};

export default UserList;
