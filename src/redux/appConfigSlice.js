import { createSlice } from '@reduxjs/toolkit';
import localStorageService from '../services/localStorageService';

const appConfigStorageName = 'appConfig';
const appConfigStorage = localStorageService.getItem(appConfigStorageName) || {};

const initialState = {
  cronRefreshStatsInterval: appConfigStorage.cronRefreshStatsInterval || '30m',
  cronRefreshStatsStatus: appConfigStorage.cronRefreshStatsStatus || false,
  f35SchedulesMetadata: appConfigStorage.f35SchedulesMetadata || [],
  warehouseMetadata: appConfigStorage.warehouseMetadata || [],
  f35Statuses: {
    1: 'PENDING',
    2: 'WAITING_PAYMENT',
    20: 'BUYING',
    21: 'RETRY',
    22: 'CONFIRMATION_RETRY',
    24: 'PURCHASE_SUCCESS',
    25: 'PENDING_ABORT',
    26: 'RETRY_CONNECTION_FAIL',
    27: 'REGISTER_FAIL',
    101: 'MANUAL',
    102: 'WARNING',
    103: 'COMPLETED',
    104: 'FAIL',
    105: 'CANCELLED',
    106: 'CANCELLED_INTERN_CLIENT',
    107: 'CANCELLED_CLIENT',
    108: 'CANCELLED_PAYMENT',
    109: 'FAIL_TO_MANUAL',
    110: 'SKIPPED',
  },
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
    updateWarehouseMetadata(state, action) {
      const { warehouseMetadata } = action.payload;
      state.warehouseMetadata = warehouseMetadata;
      localStorage.setItem(appConfigStorageName, JSON.stringify(state));
    },
  },
});

export const {
  updateCronRefreshStatsInterval,
  updateCronRefreshStatsStatus,
  updateF35SchedulesMetadata,
  updateWarehouseMetadata,
} = appConfigSlice.actions;

export default appConfigSlice.reducer;
