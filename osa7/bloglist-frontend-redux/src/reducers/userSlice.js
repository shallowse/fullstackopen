import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import loginService from '../services/login';
import blogService from '../services/blogs';

/*
  user: {
      token: '',
      username: '',
      name: '',
  }
*/
const initialState = {
  user: null,
  status: 'idle',
  error: null,
};

// LOGIN
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ username, password }) => {
    const user = await loginService.login({ username, password });
    return user;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logoutUser(state) {
      window.localStorage.removeItem('loggedBlogAppUser');
      blogService.setToken(null);
      state.user = null;
      state.status = 'idle';
      state.error = null;
    },
    setUser(state, action) {
      const user = action.payload;
      blogService.setToken(user.token);
      state.user = user;
      state.error = null;
    },
  },
  extraReducers: {
    [loginUser.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      const user = action.payload;
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user));
      blogService.setToken(user.token);
      state.user = action.payload;
      state.error = null;
    },
    [loginUser.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    },
  },
});

export const { logoutUser, setUser } = userSlice.actions;

export default userSlice.reducer;
