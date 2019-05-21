import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import HeadNext from 'next/head';

class HeadError extends PureComponent {
  static propTypes = { statusCode: PropTypes.number.isRequired };

  render() {
    const { statusCode } = this.props;

    return (
      <HeadNext>
        <title>{`${statusCode} | Skydipper`}</title>
        <meta name="description" content="Ops, something went wrong" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="Vizzuality" />
      </HeadNext>
    );
  }
}

export default HeadError;
