import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import blogService from '../services/blogs';

const initialState = {
  blogs: [],
  status: 'idle',
  error: null,
};

// GET
export const getBlogs = createAsyncThunk('blogs/getBlogs', async () => {
  const response = await blogService.getAll();
  return response;
});

// POST
export const postBlogs = createAsyncThunk(
  'blogs/postBlogs',
  async (newBlog) => {
    const response = await blogService.postNewBlog(newBlog);
    return response;
  }
);

// PUT
export const updateBlogs = createAsyncThunk(
  'blogs/updateBlogs',
  async ({ id, blog }) => {
    const response = await blogService.updateBlog(id, blog);
    return response;
  }
);

// DELETE
export const deleteBlogs = createAsyncThunk(
  'blogs/deleteBlogs',
  async (deleteBlog) => {
    await blogService.deleteBlog(deleteBlog.id);
    return deleteBlog;
  }
);

const blogsSlice = createSlice({
  name: 'blogs',
  initialState,
  extraReducers: {
    [getBlogs.pending]: (state) => {
      state.status = 'loading';
    },
    [getBlogs.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.blogs = state.blogs.concat(action.payload);
      state.error = null;
    },
    [getBlogs.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    },
    [postBlogs.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.blogs.push(action.payload);
      state.error = null;
    },
    [postBlogs.rejected]: (state, action) => {
      state.status = 'failed';
      state.error  = action.error.message;
    },
    [updateBlogs.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.blogs = state.blogs.map(blog => blog.id !== action.payload.id ? blog : action.payload);
      state.error = null;
    },
    [updateBlogs.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    },
    [deleteBlogs.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.blogs = state.blogs.filter(blog => blog.id !== action.payload.id);
      state.error = null;
    },
    [deleteBlogs.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    }
  },
});

export default blogsSlice.reducer;
