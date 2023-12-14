import { createSlice } from '@reduxjs/toolkit';
import { faker } from '@faker-js/faker';
import notificationService from '../services/notificationService';

const initialState = [];

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    notificationsUpdated(state, action) {
      state.splice(0, state.length, ...action.payload);
    },
    addNotification(state, action) {
      if (!action.payload.id) {
        action.payload.id = faker.datatype.uuid();
      }
      if (action.payload.isCritical) {
        notificationService.showCritical(action.payload.title, action.payload.description);
      }
      if (state.some((item) => item.id === action.payload.id)) {
        return;
      }
      state.push(action.payload);
    },
    updateNotification(state, action) {
      const { notification } = action.payload;
      const index = state.findIndex((item) => item.id === notification.id);
      state[index] = notification;
    },
    removeNotification(state, action) {
      const { notificationId } = action.payload;
      const index = state.findIndex((item) => item.id === notificationId);
      state.splice(index, 1);
    },
  },
});

export const { notificationsUpdated, addNotification, removeNotification, updateNotification } =
  notificationsSlice.actions;

export default notificationsSlice.reducer;
