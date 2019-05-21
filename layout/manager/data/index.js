import { connect } from 'react-redux';

import LayoutManagerData from './component';

export default connect(
  state => ({ query: state.routes.query }),
  null
)(LayoutManagerData);
