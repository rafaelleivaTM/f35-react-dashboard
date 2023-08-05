import { createSlice } from '@reduxjs/toolkit';
import { getDateFormatted } from '../utils/formatTime';

const initialState = {
  startDate: getDateFormatted(),
  endDate: getDateFormatted(),
};

const dateRangeSlice = createSlice({
  name: 'dateRange',
  initialState,
  reducers: {
    // Give case reducers meaningful past-tense "event"-style names
    dateRangeUpdated(state, action) {
      // "Mutating" update syntax thanks to Immer, and no `return` needed
      const { startDate, endDate } = action.payload;
      state.startDate = startDate;
      state.endDate = endDate;
    },
  },
});

// `createSlice` automatically generated action creators with these names.
// export them as named exports from this "slice" file
export const { dateRangeUpdated } = dateRangeSlice.actions;

// Export the slice reducer as the default export
export default dateRangeSlice.reducer;
