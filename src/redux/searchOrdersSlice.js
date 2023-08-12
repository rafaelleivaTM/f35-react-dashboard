import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searched: [],
  list: [],
  filter: {
    minDate: '',
    maxDate: '',
    robot: '',
    status: '',
    paginator: {
      page: 0,
      rowsPerPage: 10,
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
    listOrdersUpdated(state, action) {
      state.list = action.payload;
    },
  },
});

export const { searchOrdersUpdated, searchOrdersFilterUpdated, listOrdersUpdated } = searchedOrdersSlice.actions;

export default searchedOrdersSlice.reducer;
