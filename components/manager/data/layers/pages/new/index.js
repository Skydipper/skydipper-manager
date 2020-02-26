import { connect } from 'react-redux';

import LayersNew from './component';

const mapStateToProps = state => ({
  datasetId: state.routes.query.datasetId,
});

export default connect(mapStateToProps)(LayersNew);
