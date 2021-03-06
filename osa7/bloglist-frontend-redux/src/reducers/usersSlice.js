import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  users: [],
  status: 'idle',
  error: null,
};

// GET
export const getUsers = createAsyncThunk(
  'users/getUsers',
  async () => {
    const response = await axios.get('/api/users');
    return response.data;
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    updateUsers(state) {
      state.status = 'idle';
    }
  },
  extraReducers: {
    [getUsers.pending]: (state) => {
      state.status = 'loading';
    },
    [getUsers.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.users = action.payload;
      state.error = null;
    },
    [getUsers.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    }
  }
});

export const { updateUsers } = usersSlice.actions;

export default usersSlice.reducer;
