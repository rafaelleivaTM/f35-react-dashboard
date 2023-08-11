import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
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
      state.orders = action.payload;
    },
    searchOrdersFilterUpdated(state, action) {
      state.filter = action.payload;
    },
  },
});

export const { searchOrdersUpdated, searchOrdersFilterUpdated } = searchedOrdersSlice.actions;

export default searchedOrdersSlice.reducer;
