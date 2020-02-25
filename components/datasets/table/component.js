import React, { useEffect, useCallback, useReducer } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

import { fetchDatasets } from 'services/dataset';
import Spinner from 'components/ui/Spinner';
import CustomTable from 'components/ui/customtable/CustomTable';
import SearchInput from 'components/ui/SearchInput';

import { INITIAL_PAGINATION, TABLE_COLUMNS, TABLE_ACTIONS, TABLE_SORT } from './constants';
import { parseDatasets } from './helpers';

const fetchReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_INIT':
      return { ...state, loading: true, error: false, refetch: false };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        error: false,
        datasets: parseDatasets(action.payload.datasets),
        meta: {
          pages: action.payload.meta['total-pages'],
          size: action.payload.meta['total-items'],
        },
      };
    case 'FETCH_FAILURE':
      return { ...state, loading: false, error: true };
    case 'REFETCH':
      return { ...state, refetch: true };
    case 'SEARCH':
      return { ...state, page: 1, search: action.payload };
    case 'PAGE_CHANGE':
      return { ...state, page: action.payload };
    default:
      return state;
  }
};

const DatasetsTable = ({ token, userApplications }) => {
  /**
   * @type {[any, (action: any) => void]}
   */
  const [state, dispatch] = useReducer(fetchReducer, {
    loading: false,
    error: false,
    datasets: [],
    meta: {},
    search: '',
    page: 1,
    refetch: false, // Trigger manual refetch
  });

  const onSearch = useCallback(
    debounce(
      /**
       * @param {string} value Search value
       */
      value => dispatch({ type: 'SEARCH', payload: value }),
      250
    ),
    []
  );

  const onRemoveDataset = () => dispatch({ type: 'REFETCH' });

  const onChangePage = page => dispatch({ type: 'PAGE_CHANGE', payload: page });

  useEffect(() => {
    dispatch({ type: 'FETCH_INIT' });

    fetchDatasets(
      {
        includes: 'layer,metadata',
        'page[number]': state.page,
        'page[size]': INITIAL_PAGINATION.limit,
        application: userApplications.join(','),
        ...(state.search?.length > 3 ? { name: state.search } : {}),
      },
      true,
      token
    )
      .then(data => dispatch({ type: 'FETCH_SUCCESS', payload: data }))
      .catch(() => dispatch({ type: 'FETCH_FAILURE' }));
  }, [state.page, state.search, state.refetch, token, userApplications]);

  return (
    <div className="c-dataset-table">
      <Spinner className="-light" isLoading={state.loading} />
      <SearchInput
        input={{ placeholder: 'Search dataset' }}
        link={{
          label: 'New dataset',
          route: 'manager_data_detail',
          params: { tab: 'datasets', id: 'new' },
        }}
        onSearch={onSearch}
      />
      {state.error && <div className="callout alert small">Unable to load the data</div>}
      {!state.error && (
        <CustomTable
          columns={TABLE_COLUMNS}
          actions={TABLE_ACTIONS}
          sort={TABLE_SORT}
          filters={false}
          data={state.datasets}
          onRowDelete={onRemoveDataset}
          onChangePage={onChangePage}
          pagination={{ ...INITIAL_PAGINATION, page: state.page, ...state.meta }}
        />
      )}
    </div>
  );
};

DatasetsTable.propTypes = {
  token: PropTypes.string.isRequired,
  userApplications: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default DatasetsTable;
