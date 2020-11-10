import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { logoutUser } from '../reducers/loginUserSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.login.user);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <nav>
      <div>
        <Link to='/blogs'>blogs</Link>{' '}
        <Link to='/users'>users</Link>{' '}
        {user.name} logged in{' '} <button onClick={handleLogout}>logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
