import React, { PureComponent, cloneElement } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'routes';

// components
import HeaderUser from 'layout/header/header-user';

// constants
import { APP_HEADER_ITEMS } from 'layout/header/constants';

class HeaderMenu extends PureComponent {
  static propTypes = {
    routes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
  };

  headerComponents = {
    user: <HeaderUser />
  };

  render() {
    const {
      user: { token },
      routes
    } = this.props;

    return (
      <nav className="header-menu">
        <ul>
          {APP_HEADER_ITEMS.map(item => {
            const isUserLogged = !!token;

            // if user is defined but it is not equal to the current token
            if (typeof item.user !== 'undefined' && item.user !== isUserLogged) return null;

            const activeClassName = classnames({
              '-active': item.pathnames && item.pathnames.includes(routes.pathname)
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

                {!!component && cloneElement(component, item)}
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }
}

export default HeaderMenu;
