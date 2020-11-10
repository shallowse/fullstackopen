import { configureStore } from '@reduxjs/toolkit';

import notificationReducer from '../reducers/notificationSlice';
import blogsReducer from '../reducers/blogsSlice';
import usersReducer from '../reducers/usersSlice';
import loginUserReducer from '../reducers/loginUserSlice';

export default configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogsReducer,
    users: usersReducer,
    login: loginUserReducer,
  },
});
