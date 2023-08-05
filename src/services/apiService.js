const F35_API_URL = 'http://devtmia.com/f35/index';

const apiService = {
  getRobotsStats: async () => {
    const response = await fetch(`${F35_API_URL}/getRobotsStats`);
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
};

export default apiService;
