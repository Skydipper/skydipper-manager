export const DATASET_SUBTABS = [
  {
    label: 'Edit dataset',
    value: 'edit',
    route: 'manager_data_detail',
    params: { tab: 'datasets', id: '{{id}}', subtab: 'edit' }
  },
  {
    label: 'Metadata',
    value: 'metadata',
    route: 'manager_data_detail',
    params: { tab: 'datasets', id: '{{id}}', subtab: 'metadata' }
  },
  {
    label: 'Layers',
    value: 'layers',
    route: 'manager_data_detail',
    params: { tab: 'datasets', id: '{{id}}', subtab: 'layers' }
  }
];

export default { DATASET_SUBTABS };
