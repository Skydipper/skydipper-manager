import { connect } from 'react-redux';

// actions
import { setUser } from 'actions/user';

// component
import LoginModal from './component';

export default connect(
  null,
  { setUser }
)(LoginModal);
