const F35_API_URL = 'http://devtmia.com/f35/index';

const apiService = {
  getRobotsStats: async () => {
    const response = await fetch(`${F35_API_URL}/getRobotsStats`);
    const data = await response.json();
    return data;
  },
  getRobotsErrorInfo: async () => {
    const response = await fetch(`${F35_API_URL}/getRobotsErrorInfo`);
    const data = await response.json();
    return data;
  },
};

export default apiService;
