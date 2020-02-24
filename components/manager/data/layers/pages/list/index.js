import { connect } from 'react-redux';

import LayersIndex from './component';

const mapStateToProps = state => ({
  token: state.user.token,
});

export default connect(mapStateToProps)(LayersIndex);
