import React from 'react';
import PropTypes from 'prop-types';

import LayersForm from 'components/manager/data/layers/form';

const LayersNew = ({ datasetId }) => {
  return (
    <div className="c-layers-new">
      <LayersForm datasetId={datasetId} />
    </div>
  );
};

LayersNew.propTypes = {
  datasetId: PropTypes.string,
};

LayersNew.defaultProps = {
  datasetId: null,
};

export default LayersNew;
