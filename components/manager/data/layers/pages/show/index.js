import { connect } from 'react-redux';

import LayersShow from './component';

const mapStateToProps = state => ({
  layerId: state.routes.query.id,
});

export default connect(mapStateToProps)(LayersShow);
