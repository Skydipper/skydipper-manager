import { connect } from 'react-redux';

import DatasetsTable from './component';

export default connect(
  state => ({
    user: state.user
  }),
  null
)(DatasetsTable);
