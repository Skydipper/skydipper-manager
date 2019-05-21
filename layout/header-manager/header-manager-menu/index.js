import { connect } from 'react-redux';

// component
import ManagerHeaderMenu from './component';

export default connect(
  state => ({ routes: state.routes }),
  null
)(ManagerHeaderMenu);
