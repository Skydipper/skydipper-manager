import NameTD from './td/name';
import StatusTD from './td/status';
import PublishedTD from './td/published';
import OwnerTD from './td/owner';
import UpdatedAtTD from './td/updated-at';
import RelatedContentTD from './td/related-content';

import EditAction from './actions/edit';
import DeleteAction from './actions/delete';

export const INITIAL_PAGINATION = {
  // displays pagination
  enabled: true,
  // number of items per page
  limit: 20,
};

export const TABLE_COLUMNS = [
  {
    label: 'Name',
    value: 'name',
    td: NameTD,
    tdProps: { route: 'manager_data_detail' },
  },
  { label: 'Status', value: 'status', td: StatusTD },
  { label: 'Published', value: 'published', td: PublishedTD },
  { label: 'Provider', value: 'provider' },
  { label: 'Owner', value: 'owner', td: OwnerTD },
  { label: 'Updated at', value: 'updatedAt', td: UpdatedAtTD },
  {
    label: 'Related content',
    value: 'status',
    td: RelatedContentTD,
    tdProps: { route: 'manager_data_detail' },
  },
];

export const TABLE_ACTIONS = {
  show: true,
  list: [
    {
      name: 'Edit',
      route: 'manager_data_detail',
      params: { tab: 'datasets', subtab: 'edit', id: '{{id}}' },
      show: true,
      component: EditAction,
      componentProps: { route: 'manager_data_detail' },
    },
    {
      name: 'Remove',
      route: 'manager_data_detail',
      params: { tab: 'datasets', subtab: 'remove', id: '{{id}}' },
      component: DeleteAction,
    },
  ],
};

export const TABLE_SORT = {
  field: 'updatedAt',
  value: -1,
};

export default { INITIAL_PAGINATION };
