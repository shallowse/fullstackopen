import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

import { setLoginUser } from './reducers/loginUserSlice';

import Navigation from './components/Navigation';
import BlogList from './components/BlogList';
import Blog from './components/Blog';
import UserList from './components/UserList';
import User from './components/User';
import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
import NewBlogForm from './components/NewBlogForm';
import Togglable from './components/Togglable';

const App = () => {
  const user = useSelector(state => state.login.user);

  const newBlogFormRef = useRef();

  const dispatch = useDispatch();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setLoginUser(user));
    }
  }, []);

  if (user === null) {
    return (
      <Container>
        <Row>
          <Col xs={12}>
            <Notification />
          </Col>
          <Col xs={12}>
            <LoginForm />
          </Col>
        </Row>
      </Container >
    );
  }

  return (
    <Container>
      <Router>
        <Navigation />
        <Notification />
        <Switch>
          <Route
            exact
            path='/'
            render={() => (
              <>
                <Togglable buttonLabel='new note' ref={newBlogFormRef}>
                  <NewBlogForm />
                </Togglable>
                <br />
                <BlogList />
              </>
            )}
          />
          <Route exact path='/blogs/:blogId' component={Blog} />
          <Route exact path='/users' component={UserList} />
          <Route exact path='/users/:userId' component={User} />
          <Redirect to='/' />
        </Switch>
      </Router>
    </Container>
  );
};

export default App;
