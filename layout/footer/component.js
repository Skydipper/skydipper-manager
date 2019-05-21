import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// components
import CompoundMenu from 'components/ui/CompoundMenu';

class Footer extends PureComponent {
  static propTypes = {
    menu: PropTypes.array.isRequired
  };

  render() {
    const { menu } = this.props;

    return (
      <footer className="l-footer">
        <div className="footer-main">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">Skydipper</div>
            </div>
          </div>
          <CompoundMenu items={menu} />
        </div>
      </footer>
    );
  }
}

export default Footer;
