import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Button } from 'react-bootstrap';

import { logoutUser } from '../reducers/loginUserSlice';

const Navigation = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.login.user);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  // How to handle <Nav.Link> and <Link> anchors at the same time
  // https://medium.com/@bryantjiminson/
  // changing-reactjs-bootstrap-navbar-link-to-routing-based-for-single-page-application-spa-67b77dc48d4b
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand><h3>Blog app</h3></Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto" variant='tabs'>
          <Nav.Item>
            <Nav.Link as={Link} to={'/blogs'}>blogs</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to={'/users'}>users</Nav.Link>
          </Nav.Item>
        </Nav>
        {user.name} logged in&nbsp;&nbsp;
        <Button
          variant="outline-success"
          onClick={handleLogout}
        >
          logout
        </Button>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Navigation;
