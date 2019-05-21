import React, { PureComponent } from 'react';

// components
import Layout from 'layout/layout/layout-app';
import LoginModal from 'components/modal/login-modal';

class SigIn extends PureComponent {
  render() {
    return (
      <Layout
        className="l-log-in"
        title="Skydipper Sign-in/Register"
        description="Skydipper Sign-in/Register"
      >
        <div className="l-container">
          <div className="content">
            <LoginModal />
          </div>
        </div>
      </Layout>
    );
  }
}

export default SigIn;
