import { connect } from 'react-redux';

import LayersTable from './component';

export default connect(
  /** @type {(state: any) => any} */
  state => ({
    token: state.user.token,
  }),
  null
)(LayersTable);
