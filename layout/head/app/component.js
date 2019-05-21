import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import HeadNext from 'next/head';

class HeadApp extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    hostname: PropTypes.string.isRequired
  };

  static defaultProps = {
    title: null,
    description: null
  };

  render() {
    const { title, description, hostname } = this.props;
    return (
      <HeadNext>
        <title>{title ? `${title} | Skydipper` : 'Skydipper'}</title>

        <meta property="og:url" content={hostname} />
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta name="og:image:alt" content={`${title}_widget`} />

        {/* leaflet styles */}
        {/* Leaflet styles are here to allow our chunk css (custom styles) override them */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.3.1/dist/leaflet.css"
          integrity="sha512-Rksm5RenBEKSKFjgI3a41vrjkw4EVPlJ3+OiI65vTjIdo9brlAacEuKOiQ5OFh7cOI1bkDwLqdLw3Zg0cRJAAQ=="
          crossOrigin=""
          defer
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.2/leaflet.draw.css"
          crossOrigin=""
          defer
        />
      </HeadNext>
    );
  }
}

export default HeadApp;
