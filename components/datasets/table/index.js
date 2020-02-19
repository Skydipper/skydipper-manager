import { connect } from 'react-redux';

import DatasetsTable from './component';

export default connect(
  /** @type {(state: any) => any} */
  state => ({
    token: state.user.token,
  }),
  null
)(DatasetsTable);
