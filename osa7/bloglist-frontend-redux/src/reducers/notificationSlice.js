import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: '',
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    notificationAdded(state, action) {
      state.message = action.payload;
    },
  }
});

export const { notificationAdded } = notificationSlice.actions;

export default notificationSlice.reducer;
