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
};

export default apiService;
