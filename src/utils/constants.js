export const ROBOTS = [
  {
    id: 1,
    displayAvatarCode: 'DO',
    name: 'do',
    color: '#2735ef',
    active: true,
  },
  {
    id: 2,
    displayAvatarCode: 'ZINC',
    name: 'zincAMZ',
    color: '#8bc3ea',
    active: true,
  },
  {
    id: 3,
    displayAvatarCode: 'EBAY',
    name: 'ebay',
    color: '#ed52d9',
    active: true,
  },
  {
    id: 4,
    displayAvatarCode: 'ZWRT',
    name: 'zincWRT',
    color: '#70ab32',
    active: false,
  },
  {
    id: 5,
    displayAvatarCode: 'ZWRT',
    name: 'zincWRTSA',
    color: '#F2EA98FF',
    active: false,
  },
  {
    id: 5,
    displayAvatarCode: 'MIRA',
    name: 'MIRA',
    color: '#ea072f',
    active: false,
  },
];

export const F35_STATUS = {
  1: 'PENDING',
  2: 'WAITING_PAYMENT',
  20: 'BUYING',
  21: 'RETRY',
  26: 'RETRY_CONNECTION_FAIL',
  22: 'CONFIRMATION_RETRY',
  23: 'PENDING_CONFIRMATION',
  24: 'PURCHASE_SUCCESS',
  25: 'PENDING_ABORT',
  27: 'REGISTER_FAIL',
  101: 'MANUAL',
  102: 'WARNING',
  103: 'COMPLETED',
  104: 'FAIL',
  109: 'FAIL_TO_MANUAL',
  105: 'CANCELLED',
  106: 'CANCELLED_INTERN_CLIENT',
  107: 'CANCELLED_CLIENT',
  108: 'CANCELLED_PAYMENT',
  110: 'SKIPPED',
};

export const STATUS_COLORS = [
  'rgb(34,120,206)', // IN progress
  'rgb(236,158,214)', // Pending
  'rgb(247,10,10)', // Manual
  'rgb(230,114,93)', // Cancelled
  'rgb(236,216,136)', // Warning
  'rgb(64,157,95)', // Completed
  'rgb(149,149,153)', // Blocked
  'rgba(62,61,61,0.33)', // Waiting Payment
];

export const TIME_INTERVAL = {
  m: (t) => 1000 * 60 * t,
  h: (t) => 1000 * 60 * 60 * t,
  d: (t) => 1000 * 60 * 60 * 24 * t,
};

export const getScheduleCronInterval = (value) => {
  let number;
  let time;
  const regex = /^\d+[mhd]$/;
  try {
    if (!regex.test(value)) {
      throw new Error('Scheduler input is incorrect');
    }
    time = value.charAt(value.length - 1);
    if (time !== 'm' && time !== 'h' && time !== 'd') throw new Error('Time is incorrect');
    number = parseInt(value.substring(0, value.length - 1), 10);
    if (Number.isNaN(number) || number === 0) throw new Error('Number is incorrect');

    return TIME_INTERVAL[time](number);
  } catch (e) {
    return null;
  }
};
