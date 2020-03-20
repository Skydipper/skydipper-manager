import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes';
import { toastr } from 'react-redux-toastr';
import TetherComponent from 'react-tether';
import debounce from 'lodash/debounce';

// components
import Icon from 'components/ui/Icon';

class HeaderUser extends PureComponent {
  static propTypes = {
    user: PropTypes.object.isRequired,
    header: PropTypes.object.isRequired,
    setDropdownOpened: PropTypes.func.isRequired
  };

  toggleDropdown = debounce(bool => {
    this.props.setDropdownOpened({ user: bool });
  }, 50);

  // eslint-disable-next-line class-methods-use-this
  logout(e) {
    if (e) e.preventDefault();

    // TO-DO: move this to an action
    fetch(`${process.env.CONTROL_TOWER_URL}/auth/logout`, { credentials: 'include' })
      .then(() => {
        window.location.href = `/logout?callbackUrl=${window.location.href}`;
      })
      .catch(err => {
        toastr.error('Error', err);
      });
  }

  render() {
    const {
      user: { token, photo, role, email },
      header: { dropdownOpened }
    } = this.props;

    if (token) {
      const userAvatar = photo ? `url(${photo})` : 'none';

      return (
        <div className="c-avatar" style={{ backgroundImage: userAvatar }}>
          <TetherComponent
            attachment="top center"
            constraints={[{ to: 'window' }]}
            targetOffset="0 0"
            classes={{ element: 'c-header-dropdown' }}
          >
            {/* First child: This is what the item will be tethered to */}
            <a
              onMouseEnter={() => this.toggleDropdown(true)}
              onMouseLeave={() => this.toggleDropdown(false)}
            >
              {!photo && email && <span className="avatar-letter">{email.split('')[0]}</span>}
            </a>
            {/* Second child: If present, this item will be tethered to the the first child */}
            {dropdownOpened.user && (
              <div
                onMouseEnter={() => this.toggleDropdown(true)}
                onMouseLeave={() => this.toggleDropdown(false)}
              >
                <ul className="header-dropdown-list user-list">
                  <li className="header-dropdown-list-item">
                    <Link route="profile">
                      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                      <a onClick={() => this.toggleDropdown(false)}>Profile</a>
                    </Link>
                  </li>
                  <li className="header-dropdown-list-item">
                    <a onClick={this.logout} href="/logout">
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </TetherComponent>
        </div>
      );
    }

    return (
      <Link route="sign-in">
        <a className="header-menu-link">
          <Icon name="icon-user" className="-medium user-icon" />
        </a>
      </Link>
    );
  }
}

export default HeaderUser;
