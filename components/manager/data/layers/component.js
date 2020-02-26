import React from 'react';
import PropTypes from 'prop-types';

// components
import LayersNew from 'components/manager/data/layers/pages/new';
import LayersShow from 'components/manager/data/layers/pages/show';

const LayersTab = ({ layerId }) => {
  return (
    <div className="c-layers-tab">
      {layerId && layerId === 'new' && <LayersNew />}
      {layerId && layerId !== 'new' && <LayersShow />}
    </div>
  );
};

LayersTab.propTypes = {
  layerId: PropTypes.string,
};

LayersTab.defaultProps = {
  layerId: null,
};

export default LayersTab;
