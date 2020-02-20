import { connect } from 'react-redux';

import Component from './component';

const mapStateToProps = state => ({
  token: state.user.token,
  locale: state.common.locale,
  userApplications: state.user.extraUserData.apps,
});

export default connect(mapStateToProps)(Component);
