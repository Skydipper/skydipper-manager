import { connect } from 'react-redux';

// component
import LayoutProfile from './component';

export default connect(state => ({
  user: state.user
}))(LayoutProfile);
