export const DATA_TABS = [
  {
    label: 'Datasets',
    value: 'datasets',
    route: 'manager_data',
    params: { tab: 'datasets' },
  },
  {
    label: 'Layers',
    value: 'layers',
    route: 'manager_data',
    params: { tab: 'layers' },
  },
  {
    label: 'ML training',
    value: 'training',
    route: 'manager_data',
    params: { tab: 'training' },
  },
  {
    label: 'ML validation',
    value: 'validation',
    route: 'manager_data',
    params: { tab: 'validation' },
  },
  {
    label: 'ML predictions',
    value: 'predictions',
    route: 'manager_data',
    params: { tab: 'predictions' },
  },
];

export default { DATA_TABS };
