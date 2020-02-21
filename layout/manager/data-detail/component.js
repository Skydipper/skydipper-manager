import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { singular } from 'pluralize';

import { fetchDataset } from 'services/dataset';
import { fetchLayer } from 'services/LayersService';
import { capitalizeFirstLetter } from 'utils/utils';
import Layout from 'layout/layout/layout-manager';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import DatasetsTab from 'components/manager/data/datasets';
import LayersTab from 'components/manager/data/layers';

const LayoutAdminDataDetail = ({ id, tab, token }) => {
  const [name, setName] = useState('−');

  useEffect(() => {
    const fetchData = tab === 'datasets' ? fetchDataset : fetchLayer;

    if (id === 'new') {
      setName(`New ${singular(tab)}`);
    } else if (id) {
      fetchData(id, token)
        .then(data => {
          setName(data.name);
        })
        // We don't care about the error case because it's just about the title of the page
        .catch(() => null);
    }
  }, [id, tab, token]);

  return (
    <Layout title={name} description="Dataset details">
      <div className="c-page-header -manager">
        <div className="l-container -manager">
          <div className="row">
            <div className="column small-12">
              <div className="page-header-content">
                <Breadcrumbs
                  items={[
                    { name: capitalizeFirstLetter(tab), route: 'manager_data', params: { tab } },
                  ]}
                />
                <h1>{name}</h1>
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
};

LayoutAdminDataDetail.propTypes = {
  id: PropTypes.string.isRequired,
  tab: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
};

export default LayoutAdminDataDetail;
