import { createSlice } from '@reduxjs/toolkit';
import localStorageService from '../services/localStorageService';

const appConfigStorageName = 'appConfig';
const appConfigStorage = localStorageService.getItem(appConfigStorageName) || {};

const initialState = {
  cronRefreshStatsInterval: appConfigStorage.cronRefreshStatsInterval || '30m',
  cronRefreshStatsStatus: appConfigStorage.cronRefreshStatsStatus || false,
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
  },
});

export const { updateCronRefreshStatsInterval, updateCronRefreshStatsStatus } = appConfigSlice.actions;

export default appConfigSlice.reducer;
