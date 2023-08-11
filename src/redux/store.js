import { configureStore } from '@reduxjs/toolkit';
import dateRangeReducer from './dateRangeSlice';
import notificationsReducer from './notificationsSlice';
import appConfigReducer from './appConfigSlice';
import todayStatsReducer from './todayStatsSlice';
import searchOrdersReducer from './searchOrdersSlice';

export default configureStore({
  reducer: {
    dateRange: dateRangeReducer,
    notifications: notificationsReducer,
    appConfig: appConfigReducer,
    todayStats: todayStatsReducer,
    searchOrders: searchOrdersReducer,
  },
});
