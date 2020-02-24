import { connect } from 'react-redux';

import { parseTabs } from './selectors';
import DatasetsNew from './component';

export default connect(
  /** @type {(state: any) => any} state */
  state => ({
    tabs: parseTabs(state),
    id: state.routes.query.id,
    selectedTab: state.routes.query.subtab,
  }),
  null
)(DatasetsNew);
