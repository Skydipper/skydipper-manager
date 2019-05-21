import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes';

class NameTD extends PureComponent {
  static propTypes = {
    row: PropTypes.object.isRequired,
    value: PropTypes.string.isRequired
  };

  render() {
    const {
      row: { id },
      value
    } = this.props;

    return (
      <td className="main">
        <Link
          route="manager_data_detail"
          params={{
            tab: 'layers',
            subtab: 'edit',
            id
          }}
        >
          <a>{value}</a>
        </Link>
      </td>
    );
  }
}

export default NameTD;
