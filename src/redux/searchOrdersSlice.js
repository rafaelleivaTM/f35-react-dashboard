import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searched: [],
  filter: {
    minDate: '',
    maxDate: '',
    robot: '',
    status: '',
    paginator: {
      page: 0,
      rowsPerPage: 50,
    },
  },
};

const searchedOrdersSlice = createSlice({
  name: 'searchOrders',
  initialState,
  reducers: {
    searchOrdersUpdated(state, action) {
      state.searched = action.payload;
    },
    searchOrdersFilterUpdated(state, action) {
      state.filter = action.payload;
    },
  },
});

export const { searchOrdersUpdated, searchOrdersFilterUpdated } = searchedOrdersSlice.actions;

export default searchedOrdersSlice.reducer;
