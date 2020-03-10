import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// components
import Layout from 'layout/layout/layout-manager';
import Tabs from 'components/ui/Tabs';
import DatasetsIndex from 'components/manager/data/datasets/pages/list';
import LayersIndex from 'components/manager/data/layers/pages/list';
import MLValidation from 'components/manager/data/ml/validation';
import MLPredictions from 'components/manager/data/ml/predictions';

// constants
import { DATA_TABS } from './constants';

class LayoutManagerData extends PureComponent {
  static propTypes = { query: PropTypes.object.isRequired };

  render() {
    const {
      query: { tab },
    } = this.props;
    // TO-DO: set properly this in express
    const currentTab = /** @type {string} */ (tab) || 'datasets';

    return (
      <Layout
        title="Manager"
        // TO-DO: fill description
        description="Manager description..."
      >
        <div className="c-page-header -manager">
          <div className="l-container -manager">
            <div className="row">
              <div className="column small-12">
                <div className="page-header-content -with-tabs">
                  <h1>Manager</h1>
                  <Tabs options={DATA_TABS} defaultSelected={currentTab} selected={currentTab} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="c-page-section">
          <div className="l-container -manager">
            <div className="row">
              <div className="column small-12">
                {currentTab === 'datasets' && <DatasetsIndex />}
                {currentTab === 'layers' && <LayersIndex />}
                {currentTab === 'validation' && <MLValidation />}
                {currentTab === 'predictions' && <MLPredictions />}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default LayoutManagerData;
