import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes';

// components
import ErrorHead from 'layout/head/error';

class Error extends PureComponent {
  static propTypes = { statusCode: PropTypes.number };

  static defaultProps = { statusCode: 404 };

  static async getInitialProps(context) {
    const { res } = context;

    return { ...(res && { statusCode: res.statusCode }) };
  }

  render() {
    const { statusCode } = this.props;

    return (
      <div id="#main" className="l-error">
        <ErrorHead statusCode={statusCode} />
        <div className="container">
          <h1>{statusCode}</h1>
          <p>This page could not be found</p>
          <Link route="manager_home">
            <a className="c-button -primary">Go to manager</a>
          </Link>
        </div>
      </div>
    );
  }
}

export default Error;
