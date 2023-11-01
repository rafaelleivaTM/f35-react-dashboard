import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { faker } from '@faker-js/faker';
import { ROBOTS_VISUAL_DATA } from '../../utils/constants';

console.log('process.env.REACT_APP_API_URL', process.env.REACT_APP_API_URL);
export const api = createApi({
  baseQuery: fetchBaseQuery({
    // Fill in your own server starting URL here
    baseUrl: `${process.env.REACT_APP_API_URL}/f35/data`,
  }),
  endpoints: (build) => ({
    getSchedulesGroupsAndMethodsMap: build.query({
      query: () => '/getSchedulesGroupsAndMethodsMap',
    }),
    getWarehouseMetaData: build.query({
      query: () => '/getWarehouseMetaData',
    }),
    getF35GeneralSummary: build.query({
      query: (date) => `/getF35GeneralSummary?date=${date}`,
      transformResponse: (response) => response?.data?.[0],
    }),
    getSummaryEfficiencyByRobot: build.query({
      query: (params) => `/getSummaryEfficiencyByRobot?date=${params.date}&robot=${params.robot}`,
      transformResponse: (response) => response?.data?.[0],
    }),
    robotsErrorInfo: build.query({
      query: () => '/getRobotsErrorInfo',
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
    searchOrdersInF35: build.query({
      query: ({ orders, filter }) => {
        const queryParams = new URLSearchParams();
        queryParams.append('filter', JSON.stringify(filter));
        queryParams.append('orders', orders.join(','));
        return `/searchOrdersInfo?${queryParams}`;
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
      query: (orderId) => `/getOrderToPurchaseData?order=${orderId}`,
      transformResponse: (response) => response?.data?.[0],
    }),
    getOrderSchedulesForOrder: build.query({
      query: (orderId) => `/getOrderSchedules?order=${orderId}`,
      transformResponse: (response) => response?.data || [],
    }),
    getOrderProductsForOrder: build.query({
      query: (orderId) => `/getOrderProducts?order=${orderId}`,
      transformResponse: (response) => response?.data || [],
    }),
    getOrderFinalInfoForOrder: build.query({
      query: (orderId) => `/getOrderFinalInfo?order=${orderId}`,
      transformResponse: (response) => response?.data?.[0],
    }),
    getOrderRobotsInfoForOrder: build.query({
      query: (orderId) => `/getOrderRobotsInfo?order=${orderId}`,
      transformResponse: (response) => response?.data || [],
    }),
  }),
});

export const {
  useGetSchedulesGroupsAndMethodsMapQuery,
  useGetWarehouseMetaDataQuery,
  useGetF35GeneralSummaryQuery,
  useGetSummaryEfficiencyByRobotQuery,
  useRobotsErrorInfoQuery,
  useSearchOrdersInF35Query,
  useGetOrderToPurchaseDataForOrderQuery,
  useGetOrderSchedulesForOrderQuery,
  useGetOrderProductsForOrderQuery,
  useGetOrderFinalInfoForOrderQuery,
  useGetOrderRobotsInfoForOrderQuery,
} = api;
