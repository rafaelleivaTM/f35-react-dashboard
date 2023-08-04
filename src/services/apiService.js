const F35_API_URL = 'http://devtmia.com/f35/index';

const apiService = {
  getRobotsStats: async () => {
    const response = await fetch(`${F35_API_URL}/getRobotsStats`);
    return await response.json();
  },
  getRobotsErrorInfo: async () => {
    const response = await fetch(`${F35_API_URL}/getRobotsErrorInfo`);
    return await response.json();
  },
};

export default apiService;
