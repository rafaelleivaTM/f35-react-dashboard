import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  f35SummaryStats: {},
  loadingF35SummaryStats: false,
  robotsErrorInfo: [],
  loadingRobotsErrors: false,
  doSummaryStats: {},
  loadingDoSummaryStats: false,
  zincSummaryStats: {},
  loadingZincSummaryStats: false,
  ebaySummaryStats: {},
  loadingEbaySummaryStats: false,
  miraSummaryStats: {},
  loadingMiraSummaryStats: false,
};

const todayStatsSlice = createSlice({
  name: 'todayStats',
  initialState,
  reducers: {
    // Give case reducers meaningful past-tense "event"-style names
    f35SummaryStatsUpdated(state, action) {
      // "Mutating" update syntax thanks to Immer, and no `return` needed
      const { f35SummaryStats } = action.payload;
      state.f35SummaryStats = f35SummaryStats;
      state.loadingF35SummaryStats = false;
    },
    loadingF35SummaryStatsUpdated(state, action) {
      state.loadingF35SummaryStats = action.payload;
    },
    robotsErrorInfoUpdated(state, action) {
      const { robotsErrorInfo } = action.payload;
      state.robotsErrorInfo = robotsErrorInfo;
      state.loadingRobotsErrors = false;
    },
    loadingRobotsErrorsUpdated(state, action) {
      state.loadingRobotsErrors = action.payload;
    },
    doSummaryStatsUpdated(state, action) {
      const { doSummaryStats } = action.payload;
      state.doSummaryStats = doSummaryStats;
      state.loadingDoSummaryStats = false;
    },
    loadingDoSummaryStatsUpdated(state, action) {
      state.loadingDoSummaryStats = action.payload;
    },
    zincSummaryStatsUpdated(state, action) {
      const { zincSummaryStats } = action.payload;
      state.zincSummaryStats = zincSummaryStats;
      state.loadingZincSummaryStats = false;
    },
    loadingZincSummaryStatsUpdated(state, action) {
      state.loadingZincSummaryStats = action.payload;
    },
    ebaySummaryStatsUpdated(state, action) {
      const { ebaySummaryStats } = action.payload;
      state.ebaySummaryStats = ebaySummaryStats;
      state.loadingEbaySummaryStats = false;
    },
    loadingEbaySummaryStatsUpdated(state, action) {
      state.loadingEbaySummaryStats = action.payload;
    },
    miraSummaryStatsUpdated(state, action) {
      const { miraSummaryStats } = action.payload;
      state.miraSummaryStats = miraSummaryStats;
      state.loadingMiraSummaryStats = false;
    },
    loadingMiraSummaryStatsUpdated(state, action) {
      state.loadingMiraSummaryStats = action.payload;
    },
  },
});

// `createSlice` automatically generated action creators with these names.
// export them as named exports from this "slice" file

export const {
  f35SummaryStatsUpdated,
  loadingF35SummaryStatsUpdated,
  robotsErrorInfoUpdated,
  loadingRobotsErrorsUpdated,
  doSummaryStatsUpdated,
  loadingDoSummaryStatsUpdated,
  zincSummaryStatsUpdated,
  loadingZincSummaryStatsUpdated,
  ebaySummaryStatsUpdated,
  loadingEbaySummaryStatsUpdated,
  miraSummaryStatsUpdated,
  loadingMiraSummaryStatsUpdated,
} = todayStatsSlice.actions;

// Export the slice reducer as the default export
export default todayStatsSlice.reducer;
