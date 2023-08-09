// apiCalls.js
import { faker } from '@faker-js/faker';
import {
  doSummaryStatsUpdated,
  ebaySummaryStatsUpdated,
  f35SummaryStatsUpdated,
  loadingDoSummaryStatsUpdated,
  loadingEbaySummaryStatsUpdated,
  loadingF35SummaryStatsUpdated,
  loadingMiraSummaryStatsUpdated,
  loadingRobotsErrorsUpdated,
  loadingZincSummaryStatsUpdated,
  miraSummaryStatsUpdated,
  robotsErrorInfoUpdated,
  zincSummaryStatsUpdated,
} from '../redux/todayStatsSlide';
import apiService from './apiService';
import { getDateFormatted } from '../utils/formatTime';
import { ROBOTS } from '../utils/constants';

export const fetchF35ChartsDataForToday = async (dispatch) => {
  fetchF35GeneralSummaryToday(dispatch).then();
  fetchRobotsErrorInfo(dispatch).then();
  fetchDOOrdersStats(dispatch).then();
  fetchZincOrdersStats(dispatch).then();
  fetchEbayOrdersStats(dispatch).then();
  fetchMiraOrdersStats(dispatch).then();
};
export const fetchF35GeneralSummaryToday = async (dispatch) => {
  dispatch(loadingF35SummaryStatsUpdated(true));
  const response = await apiService.getF35GeneralSummaryToday();
  dispatch(f35SummaryStatsUpdated({ f35SummaryStats: response?.data?.[0] || {} }));
  console.log(`fetchF35GeneralSummaryToday`, response);
};
export const fetchRobotsErrorInfo = async (dispatch) => {
  dispatch(loadingRobotsErrorsUpdated(true));
  const data = await apiService.getRobotsErrorInfo();
  const errors = [];
  ROBOTS.forEach((robot) => {
    const robotErrorList = data[robot.name];
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
          count: error.count,
        });
      });
    }
  });
  errors.sort((a, b) => b.count - a.count);
  dispatch(robotsErrorInfoUpdated({ robotsErrorInfo: errors }));
  console.log(`fetchRobotsErrorInfo`, data);
};
export const fetchDOOrdersStats = async (dispatch) => {
  dispatch(loadingDoSummaryStatsUpdated(true));
  const response = await apiService.getSummaryEfficiencyByRobot(getDateFormatted(), 'DO');
  dispatch(doSummaryStatsUpdated({ doSummaryStats: response?.data?.[0] || {} }));
  console.log(`fetchDOOrdersStats`, response);
};
export const fetchZincOrdersStats = async (dispatch) => {
  dispatch(loadingZincSummaryStatsUpdated(true));
  const response = await apiService.getSummaryEfficiencyByRobot(getDateFormatted(), 'Zinc');
  dispatch(zincSummaryStatsUpdated({ zincSummaryStats: response?.data?.[0] || {} }));
  console.log(`fetchZincOrdersStats`, response);
};
export const fetchEbayOrdersStats = async (dispatch) => {
  dispatch(loadingEbaySummaryStatsUpdated(true));
  const response = await apiService.getSummaryEfficiencyByRobot(getDateFormatted(), 'Ebay');
  dispatch(ebaySummaryStatsUpdated({ ebaySummaryStats: response?.data?.[0] || {} }));
  console.log(`fetchEbayOrdersStats`, response);
};
export const fetchMiraOrdersStats = async (dispatch) => {
  dispatch(loadingMiraSummaryStatsUpdated(true));
  const response = await apiService.getSummaryEfficiencyByRobot(getDateFormatted(), 'Mira');
  dispatch(miraSummaryStatsUpdated({ miraSummaryStats: response?.data?.[0] || {} }));
  console.log(`fetchMiraOrdersStats`, response);
};
