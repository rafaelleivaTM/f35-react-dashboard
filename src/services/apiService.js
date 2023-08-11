import { getDateFormatted } from '../utils/formatTime';

const F35_API_URL = 'http://devtmia.com/f35/index';

const apiService = {
  getF35GeneralSummaryToday: async () => {
    const date = getDateFormatted();
    const response = await fetch(`${F35_API_URL}/getF35GeneralSummary?date=${date}`);
    return response.json();
  },
  getRobotsErrorInfo: async () => {
    const response = await fetch(`${F35_API_URL}/getRobotsErrorInfo`);
    return response.json();
  },
  getRobotsSummaryByRange: async (from, to) => {
    const response = await fetch(`${F35_API_URL}/getRobotsSummaryByRange?from=${from}&to=${to}`);
    return response.json();
  },
  getRobotsSummaryEfficiencyByRange: async (from, to) => {
    const response = await fetch(`${F35_API_URL}/getRobotsSummaryEfficiencyByRange?from=${from}&to=${to}`);
    return response.json();
  },
  getMissingOrdersBetweenBPAndF35: async () => {
    const response = await fetch(`${F35_API_URL}/checkMissingOrdersBetweenBPAndF35`);
    return response.json();
  },
  getSummaryEfficiencyByRobot: async (date, robot) => {
    const response = await fetch(`${F35_API_URL}/getSummaryEfficiencyByRobot?date=${date}&robot=${robot}`);
    return response.json();
  },
  searchOrdersInF35: async (orders, filter) => {
    const queryParams = new URLSearchParams();
    queryParams.append('filter', JSON.stringify(filter));
    queryParams.append('orders', orders.join(','));
    const url = `${F35_API_URL}/searchOrdersInfo?${queryParams}`;
    const response = await fetch(url);
    return response.json();
  },
};

export default apiService;
