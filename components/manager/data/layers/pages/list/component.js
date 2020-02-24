import React from 'react';
import PropTypes from 'prop-types';

import LayersTable from 'components/manager/data/layers/table';

const LayersIndex = ({ datasetId }) => {
  return (
    <div className="c-layers-index">
      <LayersTable datasetId={datasetId} />
    </div>
  );
};

LayersIndex.propTypes = {
  datasetId: PropTypes.string,
};

LayersIndex.defaultProps = {
  datasetId: undefined,
};

export default LayersIndex;
