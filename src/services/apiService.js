export const F35_API_URL = `${process.env.REACT_APP_API_URL}/f35`;

const apiService = {
  getRobotsSummaryByRange: async (from, to) => {
    const response = await fetch(`${F35_API_URL}/data/getRobotsSummaryByRange?from=${from}&to=${to}`);
    return response.json();
  },
  getRobotsSummaryEfficiencyByRange: async (from, to) => {
    const response = await fetch(`${F35_API_URL}/data/getRobotsSummaryEfficiencyByRange?from=${from}&to=${to}`);
    return response.json();
  },
  // getIncomingOrdersByRange: async (from, to) => {
  //   const response = await fetch(`${F35_API_URL}/data/getIncomingOrders?from=${from}&to=${to}`);
  //   return response.json();
  // },
  getMissingOrdersBetweenBPAndF35: async () => {
    const response = await fetch(`${F35_API_URL}/data/checkMissingOrdersBetweenBPAndF35`);
    return response.json();
  },
  getOrdersListSchedules: async (orders) => {
    const response = await fetch(`${F35_API_URL}/data/getOrderListSchedules?orders=${orders.join(',')}`);
    return response.json();
  },
  createPurchaseGroup: async (purchaseGroup) => {
    const response = await fetch(`${F35_API_URL}/management/purchase-group`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(purchaseGroup),
    });

    return response.json();
  },
  importOrders: async (orders) => {
    const response = await fetch(`${F35_API_URL}/management/import-orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orders }),
    });

    return response.json();
  },
};

export default apiService;
