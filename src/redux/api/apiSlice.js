import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { faker } from '@faker-js/faker';
import { ROBOTS_VISUAL_DATA } from '../../utils/constants';

console.log('process.env.REACT_APP_API_URL', process.env.REACT_APP_API_URL);
export const api = createApi({
  baseQuery: fetchBaseQuery({
    // Fill in your own server starting URL here
    baseUrl: `${process.env.REACT_APP_API_URL}/f35`,
  }),
  endpoints: (build) => ({
    getSchedulesGroupsAndMethodsMap: build.query({
      query: () => '/data/getSchedulesGroupsAndMethodsMap',
    }),
    getWarehouseMetaData: build.query({
      query: () => '/data/getWarehouseMetaData',
    }),
    getF35GeneralSummary: build.query({
      query: (date) => `/data/getF35GeneralSummary?date=${date}`,
      transformResponse: (response) => response?.data?.[0],
    }),
    getSummaryEfficiencyByRobot: build.query({
      query: (params) => `/data/getSummaryEfficiencyByRobot?date=${params.date}&robot=${params.robot}`,
      transformResponse: (response) => response?.data?.[0],
    }),
    robotsErrorInfo: build.query({
      query: (dateRange) => `/data/getRobotsErrorInfo?from=${dateRange?.startDate}&to=${dateRange?.endDate}`,
      transformResponse: (response) => {
        const errors = [];
        ROBOTS_VISUAL_DATA.forEach((robot) => {
          const robotErrorList = response?.data?.[robot.name];
          if (robotErrorList) {
            robotErrorList.forEach((error) => {
              errors.push({
                id: faker.datatype.uuid(),
                title: `${error.error.substring(0, 50)}...`,
                description: error.error,
                robotName: robot.name,
                robotCode: robot.displayAvatarCode,
                color: robot.color,
                postedAt: faker.date.recent().toISOString(),
                count: error.count.toString(),
              });
            });
          }
        });
        errors.sort((a, b) => b.count - a.count);
        return errors;
      },
    }),
    incomingOrdersByRange: build.query({
      query: (dateRange) => `/data/getIncomingOrders?from=${dateRange?.startDate}&to=${dateRange?.endDate}`,
      transformResponse: (response) => response?.data,
    }),
    searchOrdersInF35: build.query({
      query: ({ orders, filter }) => {
        const queryParams = new URLSearchParams();
        queryParams.append('filter', JSON.stringify(filter));
        queryParams.append('orders', orders.join(','));
        return `/data/searchOrdersInfo?${queryParams}`;
      },
      transformResponse: (response) => {
        const orders = response?.data || [];
        const orderList = orders.map((order) => ({
          id: order.id,
          orderId: order.order_id,
          so: order.so,
          warehouseId: order.warehouseId,
          orderStatus: order.order_status,
          customerEmail: order.customer_email,
          schedules: order.schedules,
          schedulesStatuses: order.statuses,
          createdAt: order.created_at,
        }));
        return orderList;
      },
    }),
    getOrderToPurchaseDataForOrder: build.query({
      query: (orderId) => `/data/getOrderToPurchaseData?order=${orderId}`,
      transformResponse: (response) => response?.data?.[0],
    }),
    getOrderSchedulesForOrder: build.query({
      query: (orderId) => `/data/getOrderSchedules?order=${orderId}`,
      transformResponse: (response) => response?.data || [],
    }),
    getOrderProductsForOrder: build.query({
      query: (orderId) => `/data/getOrderProducts?order=${orderId}`,
      transformResponse: (response) => response?.data || [],
    }),
    getOrderFinalInfoForOrder: build.query({
      query: (orderId) => `/data/getOrderFinalInfo?order=${orderId}`,
      transformResponse: (response) => response?.data?.[0],
    }),
    getOrderRobotsInfoForOrder: build.query({
      query: (orderId) => `/data/getOrderRobotsInfo?order=${orderId}`,
      transformResponse: (response) => response?.data || [],
    }),
    deleteSchedules: build.mutation({
      query: (ids) => {
        return {
          url: `/management/schedules`,
          body: {
            ids,
          },
          method: 'DELETE',
        };
      },
    }),
    updateOrdersToRePurchase: build.mutation({
      query: (orders) => {
        return {
          url: `/management/update-orders-re-purchase-group`,
          body: {
            orders,
          },
          method: 'POST',
        };
      },
    }),
  }),
});

export const {
  useGetSchedulesGroupsAndMethodsMapQuery,
  useGetWarehouseMetaDataQuery,
  useGetF35GeneralSummaryQuery,
  useGetSummaryEfficiencyByRobotQuery,
  useRobotsErrorInfoQuery,
  useIncomingOrdersByRangeQuery,
  useSearchOrdersInF35Query,
  useGetOrderToPurchaseDataForOrderQuery,
  useGetOrderSchedulesForOrderQuery,
  useGetOrderProductsForOrderQuery,
  useGetOrderFinalInfoForOrderQuery,
  useGetOrderRobotsInfoForOrderQuery,
  useDeleteSchedulesMutation,
  useUpdateOrdersToRepurchaseMutation,
} = api;
