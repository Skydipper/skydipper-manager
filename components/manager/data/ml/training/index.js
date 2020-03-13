import { connect } from 'react-redux';

import Component from './component';

const mapStateToProps = state => ({
  token: state.user.token,
});

export default connect(mapStateToProps)(Component);
