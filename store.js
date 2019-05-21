import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import thunk from 'redux-thunk';
import { handleModule } from 'redux-tools';

// TO-DO: move actions to modules
import * as reducers from 'actions';
import modules from 'modules';

// Layout
import * as header from 'layout/header';
import * as headerManager from 'layout/header-manager';

// Dataset
import * as trySubscriptionModal from 'components/datasets/form/try-subscription-modal';

// Manager Interactions
import * as managerInteractions from 'components/manager/data/layers/form/interactions';
import * as managerLayerPreview from 'components/manager/data/layers/form/layer-preview';

// React responsive redux
import { reducer as responsiveReducer } from 'react-responsive-redux';

// REDUCERS
const reducer = combineReducers({
  ...reducers,
  ...modules,

  // React responsive
  responsive: responsiveReducer,

  // Header
  header: handleModule(header),
  headerManager: handleModule(headerManager),

  // Dataset
  trySubscriptionModal: handleModule(trySubscriptionModal),

  // Manager interactions
  interactions: handleModule(managerInteractions),

  // Manager layer preview
  managerLayerPreview: handleModule(managerLayerPreview)
});

// eslint-disable-next-line import/prefer-default-export
export const initStore = (initialState = {}) =>
  createStore(
    reducer,
    initialState,
    composeWithDevTools(
      /* The router middleware MUST be before thunk otherwise the URL changes
       * inside a thunk function won't work properly */
      applyMiddleware(thunk)
    )
  );
