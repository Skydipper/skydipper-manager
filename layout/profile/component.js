import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// components
import Layout from 'layout/layout/layout-app';
import Title from 'components/ui/Title';
import Profile from 'components/app/profile';

class LayoutMyRW extends PureComponent {
  static propTypes = {
    user: PropTypes.object.isRequired
  };

  render() {
    const { user } = this.props;
    const userName = user.name ? ` ${user.name.split(' ')[0]}` : '';
    const title = userName ? `Hi${userName}!` : 'Profile';

    return (
      <Layout title="Profile" description="Skydipper user profile" pageHeader>
        <div className="c-page-header">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <div className="page-header-content">
                  <Title className="-primary -huge page-header-title">{title}</Title>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="c-page-section">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <Profile />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default LayoutMyRW;
