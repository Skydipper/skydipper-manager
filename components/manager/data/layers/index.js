import { connect } from 'react-redux';

import LayersTab from './component';

const mapStateToProps = state => ({
  layerId: state.routes.query.id,
});

export default connect(mapStateToProps)(LayersTab);
