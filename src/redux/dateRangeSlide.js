import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  startDate: new Date(),
  endDate: new Date(),
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
    // todoToggled(state, action) {
    //   // Look for the specific nested object to update.
    //   // In this case, `action.payload` is the default field in the action,
    //   // and can hold the `id` value - no need for `action.id` separately
    //   const matchingTodo = state.todos.find(todo1 => todo1.id === action.payload)
    //
    //   if (matchingTodo) {
    //     // Can directly "mutate" the nested object
    //     matchingTodo.completed = !matchingTodo.completed
    //   }
    // }
  },
});

// `createSlice` automatically generated action creators with these names.
// export them as named exports from this "slice" file
export const { dateRangeUpdated } = dateRangeSlice.actions;

// Export the slice reducer as the default export
export default dateRangeSlice.reducer;
