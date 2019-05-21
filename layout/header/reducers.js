import * as actions from './actions';

export default {
  [actions.setMobileOpened]: (state, action) => ({ ...state, mobileOpened: action.payload }),
  [actions.setDropdownOpened]: (state, action) => ({
    ...state,
    dropdownOpened: {
      ...{ user: false },
      ...action.payload
    }
  })
};
