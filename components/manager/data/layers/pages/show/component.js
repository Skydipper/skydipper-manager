import React from 'react';
import PropTypes from 'prop-types';

// components
import LayersForm from 'components/manager/data/layers/form';

const LayersShow = ({ layerId }) => {
  return (
    <div className="c-layers-show">
      <LayersForm layerId={layerId} />
    </div>
  );
};

LayersShow.propTypes = {
  layerId: PropTypes.string.isRequired,
};

export default LayersShow;
