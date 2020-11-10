import { configureStore } from '@reduxjs/toolkit';

import notificationReducer from '../reducers/notificationSlice';
import blogsReducer from '../reducers/blogsSlice';

export default configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogsReducer,
  },
});
