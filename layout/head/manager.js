import React from 'react';
import PropTypes from 'prop-types';
import HeadNext from 'next/head';

const HeadManager = ({ title, description }) => (
  <HeadNext>
    <title>{title} | Skydipper manager</title>
    <meta name="description" content={description} />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="author" content="Vizzuality" />
    <link
      rel="stylesheet"
      media="screen"
      href="https://fonts.googleapis.com/css?family=Lato:400,300,700"
    />

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

HeadManager.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};

export default HeadManager;
