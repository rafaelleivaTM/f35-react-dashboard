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

export const STATUS_COLORS = [
  'rgb(36,157,241)', // IN progress
  'rgb(193,104,169)', // Pending
  'rgb(248,157,157)', // Waiting Payment
  'rgb(142,244,8)', // Manual
  'rgba(153, 102, 255, 1)', // Cancelled
  'rgba(255, 159, 64, 1)', // Warning
  'rgb(27,157,114)', // Completed
  'rgb(190,190,190)', // Blocked
];

export const TIME_INTERVAL = {
  m: (t) => {
    return 1000 * 60 * t;
  },
  h: (t) => {
    return 1000 * 60 * 60 * t;
  },
  d: (t) => {
    return 1000 * 60 * 60 * 24 * t;
  },
};
