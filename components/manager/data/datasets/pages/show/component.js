import React from 'react';
import { StickyContainer, Sticky } from 'react-sticky';
import PropTypes from 'prop-types';

import Aside from 'components/ui/Aside';
import DatasetsForm from 'components/datasets/form';
import MetadataForm from 'components/datasets/metadata/form';
import TagsForm from 'components/manager/tags/TagsForm';
import LayersIndex from 'components/manager/data/layers/pages/list';

const DatasetsShow = ({ id, tabs, selectedTab }) => {
  return (
    <div className="c-datasets-show">
      <StickyContainer>
        <div className="row l-row">
          <div className="columns small-12 medium-3">
            <Sticky>
              {({ style }) => (
                <div style={style}>
                  <Aside items={tabs} selected={selectedTab} />
                </div>
              )}
            </Sticky>
          </div>

          <div className="columns small-12 medium-9">
            {selectedTab === 'edit' && <DatasetsForm datasetId={id} />}

            {selectedTab === 'metadata' && <MetadataForm datasetId={id} />}

            {selectedTab === 'tags' && <TagsForm dataset={id} />}

            {selectedTab === 'layers' && <LayersIndex />}
          </div>
        </div>
      </StickyContainer>
    </div>
  );
};

DatasetsShow.propTypes = {
  id: PropTypes.string.isRequired,
  tabs: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedTab: PropTypes.string,
};

DatasetsShow.defaultProps = {
  selectedTab: 'edit',
};

export default DatasetsShow;
