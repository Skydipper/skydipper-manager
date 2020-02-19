import React, { useReducer, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

import { fetchLayers } from 'services/LayersService';
import Spinner from 'components/ui/Spinner';
import CustomTable from 'components/ui/customtable/CustomTable';
import SearchInput from 'components/ui/SearchInput';

import { INITIAL_PAGINATION, TABLE_COLUMNS, TABLE_ACTIONS, TABLE_SORT } from './constants';

const fetchReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_INIT':
      return { ...state, loading: true, error: false, refetch: false };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        error: false,
        layers: action.payload.layers,
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

const LayersTable = ({ token }) => {
  /**
   * @type {[any, (action: any) => void]}
   */
  const [state, dispatch] = useReducer(fetchReducer, {
    loading: false,
    error: false,
    layers: [],
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

  const onRemoveLayer = () => dispatch({ type: 'REFETCH' });

  const onChangePage = page => dispatch({ type: 'PAGE_CHANGE', payload: page });

  useEffect(() => {
    dispatch({ type: 'FETCH_INIT' });

    fetchLayers(
      {
        includes: 'user',
        'page[number]': state.page,
        'page[size]': INITIAL_PAGINATION.limit,
        application: process.env.APPLICATIONS,
        ...(state.search?.length > 3 ? { name: state.search } : {}),
      },
      true,
      token
    )
      .then(data => dispatch({ type: 'FETCH_SUCCESS', payload: data }))
      .catch(() => dispatch({ type: 'FETCH_FAILURE' }));
  }, [state.page, state.search, state.refetch, token]);

  return (
    <div className="c-layer-table">
      <Spinner className="-light" isLoading={state.loading} />
      <SearchInput
        input={{ placeholder: 'Search layer' }}
        link={{
          label: 'New layer',
          route: 'manager_data_detail',
          params: {
            tab: 'layers',
            id: 'new',
          },
        }}
        onSearch={onSearch}
      />
      {state.error && <p>Unable to load the data</p>}
      {!state.error && (
        <CustomTable
          columns={TABLE_COLUMNS}
          actions={TABLE_ACTIONS}
          sort={TABLE_SORT}
          filters={false}
          data={state.layers}
          onRowDelete={onRemoveLayer}
          onChangePage={onChangePage}
          pagination={{ ...INITIAL_PAGINATION, page: state.page, ...state.meta }}
        />
      )}
    </div>
  );
};

LayersTable.propTypes = {
  token: PropTypes.string.isRequired,
};

export default LayersTable;
