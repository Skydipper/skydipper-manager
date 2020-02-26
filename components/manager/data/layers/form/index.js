import { connect } from 'react-redux';

import { setLayerInteractionError } from 'components/manager/data/layers/form/layer-preview/layer-preview-actions';
import Component from './component';

const mapStateToProps = state => ({
  token: state.user.token,
  locale: state.common.locale,
  userApplications: state.user.extraUserData.apps,
  managerLayerPreview: state.managerLayerPreview,
});

const mapDispatchToProps = dispatch => ({
  setLayerInteractionError: (...params) => dispatch(setLayerInteractionError(...params)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Component);
