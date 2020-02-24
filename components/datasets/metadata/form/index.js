import { connect } from 'react-redux';

import { setSources, resetSources } from 'actions/manager/sources';
import Component from './component';

const mapStateToProps = state => ({
  token: state.user.token,
  locale: state.common.locale,
  userApplications: state.user.extraUserData.apps,
});

const mapDispatchToProps = {
  setSources,
  resetSources,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Component);
