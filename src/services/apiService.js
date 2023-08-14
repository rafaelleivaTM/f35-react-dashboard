export const F35_API_URL = process.env.REACT_APP_API_URL;

const apiService = {
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
