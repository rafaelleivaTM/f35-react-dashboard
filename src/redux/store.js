import { configureStore } from '@reduxjs/toolkit';
import dateRangeReducer from './dateRangeSlide';
import notificationsReducer from './notificationsSlide';

export default configureStore({
  reducer: {
    dateRange: dateRangeReducer,
    notifications: notificationsReducer,
  },
});
