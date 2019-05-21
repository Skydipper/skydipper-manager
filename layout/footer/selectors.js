import { createSelector } from 'reselect';

// constants
import { FOOTER_LINKS } from './constants';

export const getMenu = createSelector(
  [],
  () =>
    FOOTER_LINKS.filter(i => i.id !== 'search' && i.id !== 'user').map(i => {
      const parent = [i];
      const { children = [] } = i;
      return [...parent, ...children];
    })
);

export default {
  getMenu
};
