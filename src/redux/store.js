import { configureStore } from '@reduxjs/toolkit';
import dateRangeReducer from './dateRangeSlice';
import notificationsReducer from './notificationsSlice';
import appConfigReducer from './appConfigSlice';
import searchOrdersReducer from './searchOrdersSlice';
import { api } from './api/apiSlice';

const apiLogger = () => (next) => (action) => {
  if (action.type.startsWith('api/executeQuery')) {
    console.log(`Ejecutando llamada al API: ${action?.meta?.arg?.endpointName}`, action.meta.arg);
  }
  return next(action);
};

export default configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    dateRange: dateRangeReducer,
    notifications: notificationsReducer,
    appConfig: appConfigReducer,
    searchOrders: searchOrdersReducer,
  },
  // Add the RTK Query API middleware
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware).concat(apiLogger),
});
