import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { singular } from 'pluralize';
import { toastr } from 'react-redux-toastr';

// components
import Layout from 'layout/layout/layout-manager';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import DatasetsTab from 'components/manager/data/datasets';
import LayersTab from 'components/manager/data/layers';

// services
import { fetchDataset } from 'services/dataset';
import { fetchLayer } from 'services/LayersService';

// utils
import { capitalizeFirstLetter } from 'utils/utils';

class LayoutAdminDataDetail extends PureComponent {
  static propTypes = { query: PropTypes.object.isRequired };

  state = { data: null };

  componentWillMount() {
    const {
      query: { id }
    } = this.props;

    if (id === 'new') return;

    this.getData();
  }

  getName() {
    const {
      query: { tab, id }
    } = this.props;
    const { data } = this.state;

    if (id === 'new') return `New ${singular(tab)}`;
    if (data && data.name) return data.name;

    return '-';
  }

  getData() {
    const {
      query: { tab, id }
    } = this.props;

    if (tab === 'datasets') {
      fetchDataset(id)
        .then(dataset => {
          this.setState({ data: dataset });
        })
        .catch(err => {
          toastr.error('Error', err.message);
        });
    }

    if (tab === 'layers') {
      fetchLayer(id)
        .then(layer => {
          this.setState({ data: layer });
        })
        .catch(err => {
          toastr.error('Error', err.message);
        });
    }
  }

  render() {
    const {
      query: { tab, dataset }
    } = this.props;

    return (
      <Layout
        title={this.getName()}
        // TO-DO: fill description
        description="Data detail..."
      >
        <div className="c-page-header -manager">
          <div className="l-container -manager">
            <div className="row">
              <div className="column small-12">
                <div className="page-header-content">
                  {dataset && tab !== 'datasets' && (
                    <Breadcrumbs
                      items={[
                        {
                          name: capitalizeFirstLetter(tab),
                          route: 'manager_data_detail',
                          params: { tab: 'datasets', subtab: tab, id: dataset }
                        }
                      ]}
                    />
                  )}
                  {!dataset && (
                    <Breadcrumbs
                      items={[
                        { name: capitalizeFirstLetter(tab), route: 'manager_data', params: { tab } }
                      ]}
                    />
                  )}
                  <h1>{this.getName()}</h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="c-page-section">
          <div className="l-container -manager">
            <div className="row">
              <div className="column small-12">
                {tab === 'datasets' && <DatasetsTab />}
                {tab === 'layers' && <LayersTab />}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default LayoutAdminDataDetail;
