import { createSlice } from '@reduxjs/toolkit';
import localStorageService from '../services/localStorageService';

const appConfigStorageName = 'appConfig';
const appConfigStorage = localStorageService.getItem(appConfigStorageName) || {};

const initialState = {
  cronRefreshStatsInterval: appConfigStorage.cronRefreshStatsInterval || '30m',
  cronRefreshStatsStatus: appConfigStorage.cronRefreshStatsStatus || false,
  f35SchedulesMetadata: appConfigStorage.f35SchedulesMetadata || [],
};

const appConfigSlice = createSlice({
  name: appConfigStorageName,
  initialState,
  reducers: {
    updateCronRefreshStatsInterval(state, action) {
      const { cronRefreshStatsInterval } = action.payload;
      state.cronRefreshStatsInterval = cronRefreshStatsInterval;
      localStorage.setItem(appConfigStorageName, JSON.stringify(state));
    },
    updateCronRefreshStatsStatus(state, action) {
      const { cronRefreshStatsStatus } = action.payload;
      state.cronRefreshStatsStatus = cronRefreshStatsStatus;
      localStorage.setItem(appConfigStorageName, JSON.stringify(state));
    },
    updateF35SchedulesMetadata(state, action) {
      const { f35SchedulesMetadata } = action.payload;
      state.f35SchedulesMetadata = f35SchedulesMetadata;
      localStorage.setItem(appConfigStorageName, JSON.stringify(state));
    },
  },
});

export const { updateCronRefreshStatsInterval, updateCronRefreshStatsStatus, updateF35SchedulesMetadata } =
  appConfigSlice.actions;

export default appConfigSlice.reducer;
