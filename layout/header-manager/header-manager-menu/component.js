import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'routes';

// components
import HeaderUser from 'layout/header-manager/header-manager-user';

// constants
import { MANAGER_HEADER_ITEMS } from 'layout/header-manager/constants';

class ManagerHeaderMenu extends PureComponent {
  static propTypes = { routes: PropTypes.object.isRequired };

  headerComponents = { user: <HeaderUser /> };

  render() {
    const {
      routes: { pathname }
    } = this.props;

    return (
      <nav className="header-menu">
        <ul>
          {MANAGER_HEADER_ITEMS.map(item => {
            const activeClassName = classnames({
              '-active': item.pathnames && item.pathnames.includes(pathname)
            });
            const component = this.headerComponents[item.id];

            return (
              <li key={item.label} className={activeClassName}>
                {!component && item.route && (
                  <Link route={item.route} params={item.params}>
                    <a>{item.label}</a>
                  </Link>
                )}

                {!component && item.href && <a href={item.href}>{item.label}</a>}

                {!!component && component}
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }
}

export default ManagerHeaderMenu;
