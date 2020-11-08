import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';
import Blog from './Blog';

// Docs: https://github.com/testing-library/jest-dom#tohavetextcontent

const blog = {
  title: 'Test title',
  likes: 10,
  author: 'Jack Doe',
  url: 'http://example.com/jack',
  user: '5fa1310426236f642eb832f2',
};

let component;

describe('Tehtävä 5.13', () => {
  beforeEach(() => {
    component = render(<Blog blog={blog} />);
    //component.debug();
  });

  test('title and author are rendered', () => {
    expect(component.container).toHaveTextContent(`${blog.title} ${blog.author}`);
  });

  test('url is not rendered', () => {
    expect(component.container).not.toHaveTextContent(`${blog.url}`);
  });

  test('likes is not rendered', () => {
    expect(component.container).not.toHaveTextContent(`likes ${blog.likes}`);
  });
});

describe('Tehtävä 5.14', () => {
  beforeEach(() => {
    component = render(<Blog blog={blog} />);

    const button = component.container.querySelector('.viewAllButton');
    fireEvent.click(button);
    //component.debug();
  });

  test('url is rendered', () => {
    expect(component.container).toHaveTextContent(`${blog.url}`);
  });

  test('likes is rendered', () => {
    expect(component.container).toHaveTextContent(`likes ${blog.likes}`);
  });
});

describe('Tehtävä 5.15', () => {
  let mockHandler;

  beforeEach(() => {
    mockHandler = jest.fn();
    component = render(<Blog blog={blog} handleUpdateLike={mockHandler} />);
    const viewAllButton = component.container.querySelector('.viewAllButton');
    fireEvent.click(viewAllButton);
  });

  test('clicking the like button twice calls event handler twice', () => {
    const button = component.container.querySelector('.likeButton');
    fireEvent.click(button);
    fireEvent.click(button);

    expect(mockHandler.mock.calls.length).toBe(2);
  });
});
