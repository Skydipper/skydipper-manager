import { connect } from 'react-redux';

// actions
import { setDropdownOpened } from '../actions';

// component
import ManagerHeaderUser from './component';

export default connect(
  state => ({
    header: state.headerManager,
    user: state.user
  }),
  { setDropdownOpened }
)(ManagerHeaderUser);
