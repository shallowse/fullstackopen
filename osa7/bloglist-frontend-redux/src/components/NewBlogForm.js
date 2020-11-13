import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Row, Col, Form, Button } from 'react-bootstrap';

import { postBlogs } from '../reducers/blogsSlice';
import { notificationAdded } from '../reducers/notificationSlice';
import { updateUsers } from '../reducers/usersSlice';

const NewBlogForm = () => {
  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [newBlogAuthor, setNewBlogAuthor] = useState('');
  const [newBlogUrl, setNewBlogUrl] = useState('');

  const dispatch = useDispatch();

  const handleNewBlog = (event) => {
    event.preventDefault();
    if (!(newBlogTitle && newBlogAuthor && newBlogUrl)) {
      dispatch(notificationAdded('some fields are missing content.'));
      setTimeout(() => {
        dispatch(notificationAdded(''));
      }, 5000);
      return;
    }

    const newBlog = {
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl,
    };

    dispatch(postBlogs(newBlog));
    dispatch(notificationAdded(`Added ${newBlog.title}`));
    setTimeout(() => {
      dispatch(notificationAdded(''));
    }, 5000);

    dispatch(updateUsers());
    setNewBlogTitle('');
    setNewBlogAuthor('');
    setNewBlogUrl('');
  };

  return (
    <div>
      <h2>Create new</h2>
      <Form onSubmit={handleNewBlog}>

        <Form.Group as={Row} >
          <Form.Label column sm={2}>
            Title:
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              id='title'
              type='text'
              value={newBlogTitle}
              onChange={({ target }) => setNewBlogTitle(target.value)}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} >
          <Form.Label column sm={2}>
            Author:
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              id='author'
              type='text'
              value={newBlogAuthor}
              onChange={({ target }) => setNewBlogAuthor(target.value)}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} >
          <Form.Label column sm={2}>
            Url:
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              id='url'
              type='text'
              value={newBlogUrl}
              onChange={({ target }) => setNewBlogUrl(target.value)}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Col sm={{ span: 10, offset: 2 }}>
            <Button
              id='createButton'
              type='submit'
              variant='outline-secondary'
            >create</Button>
          </Col>
        </Form.Group>
      </Form>
    </div>
  );
};


export default NewBlogForm;
