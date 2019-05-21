import { connect } from 'react-redux';

// actions
import { setMobileOpened } from '../actions';

// component
import ManagerHeaderMenuMobile from './component';

export default connect(
  state => ({
    header: state.headerAdmin,
    routes: state.routes
  }),
  { setMobileOpened }
)(ManagerHeaderMenuMobile);
