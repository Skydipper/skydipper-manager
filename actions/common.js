import { Router } from 'routes';

const SET_LOCALE = 'common/SET_LOCALE';
const SET_IS_SERVER = 'common/SET_IS_SERVER';
const SET_HOSTNAME = 'common/SET_HOSTNAME';

const initialState = {
  locale: 'en',
  isServer: true,
  hostname: 'http://www.resourcewatch.org'
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_LOCALE:
      return Object.assign({}, state, { locale: action.payload });

    case SET_IS_SERVER:
      return Object.assign({}, state, { isServer: action.payload });

    case SET_HOSTNAME:
      return Object.assign({}, state, { hostname: action.payload });

    default:
      return state;
  }
}

/**
 * ACTIONS
 */

export function redirectTo(url) {
  return dispatch => {
    dispatch(Router.pushRoute(url));
  };
}

/**
 * Set the locale of the app (used by the API)
 * NOTE: doesn't not change the language of the app, only
 * Transifex can do so
 * @param {string} locale Two-letter locale
 */
export function setLocale(locale) {
  return {
    type: SET_LOCALE,
    payload: locale
  };
}

/**
 * Set if we are on the server side or not
 * @param {boolean} isServer boolean
 */
export function setIsServer(isServer) {
  return {
    type: SET_IS_SERVER,
    payload: isServer
  };
}

/**
 * Set hostname
 * @param {string} hostname
 */
export function setHostname(hostname) {
  return {
    type: SET_HOSTNAME,
    payload: hostname
  };
}
