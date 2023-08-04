import { configureStore } from '@reduxjs/toolkit';
import dateRangeReducer from './dateRangeSlide';

export default configureStore({
  reducer: {
    dateRange: dateRangeReducer,
  },
});
