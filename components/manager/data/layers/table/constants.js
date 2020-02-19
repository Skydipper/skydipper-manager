import NameTD from './td/name';
import OwnerTD from './td/owner';
import UpdatedAtTD from './td/updated-at';
import EditAction from './actions/edit';
import DeleteAction from './actions/delete';
import GoToDatasetAction from './actions/go-to-dataset';

export const INITIAL_PAGINATION = {
  // displays pagination
  enabled: true,
  // number of items per page
  limit: 20,
};
export const TABLE_COLUMNS = [
  { label: 'Name', value: 'name', td: NameTD },
  { label: 'Provider', value: 'provider' },
  { label: 'Owner', value: 'owner', td: OwnerTD },
  { label: 'Updated at', value: 'updatedAt', td: UpdatedAtTD },
];

export const TABLE_ACTIONS = {
  show: true,
  list: [
    {
      name: 'Edit',
      route: 'manager_data_detail',
      params: { tab: 'layers', subtab: 'edit', id: '{{id}}' },
      show: true,
      component: EditAction,
    },
    {
      name: 'Remove',
      route: 'manager_data_detail',
      params: { tab: 'layers', subtab: 'remove', id: '{{id}}' },
      component: DeleteAction,
    },
    {
      name: 'Go to dataset',
      route: 'manager_data_detail',
      params: { tab: 'datasets', subtab: 'edit', id: '{{id}}' },
      component: GoToDatasetAction,
    },
  ],
};

export const TABLE_SORT = {
  field: 'updatedAt',
  value: -1,
};

export default { INITIAL_PAGINATION };
