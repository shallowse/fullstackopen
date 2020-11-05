import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import NewBlogForm from './NewBlogForm';

describe('Tehtävä 5.16', () => {

  test('<NewBlogForm /> updates parent state and calls onSubmit', () => {
    const mockHandleSubmit = jest.fn();

    const component = render(<NewBlogForm handleSubmit={mockHandleSubmit} />);

    const title = component.container.querySelector('#title');
    const author = component.container.querySelector('#author');
    const url = component.container.querySelector('#url');
    const form = component.container.querySelector('form');

    fireEvent.change(title, { target: { value: 'Example title' } });
    fireEvent.change(author, { target: { value: 'Jill Doe' } });
    fireEvent.change(url, { target: { value: 'https://www.example.com/tehtava516' } });
    fireEvent.submit(form);

    //console.log(mockHandleSubmit.mock.calls);
    expect(mockHandleSubmit.mock.calls.length).toBe(1);
    expect(mockHandleSubmit.mock.calls[0][0].title).toBe('Example title');
    expect(mockHandleSubmit.mock.calls[0][0].author).toBe('Jill Doe');
    expect(mockHandleSubmit.mock.calls[0][0].url).toBe('https://www.example.com/tehtava516');
  });
});
