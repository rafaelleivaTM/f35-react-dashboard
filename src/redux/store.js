import { configureStore } from '@reduxjs/toolkit';
import dateRangeReducer from './dateRangeSlide';
import notificationsReducer from './notificationsSlide';
import appConfigReducer from './appConfigSlide';
import todayStatsReducer from './todayStatsSlide';

export default configureStore({
  reducer: {
    dateRange: dateRangeReducer,
    notifications: notificationsReducer,
    appConfig: appConfigReducer,
    todayStats: todayStatsReducer,
  },
});
