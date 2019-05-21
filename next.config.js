require('dotenv').config();

const webpack = require('webpack');
const withSass = require('@zeit/next-sass');

module.exports = withSass({
  useFileSystemPublicRoutes: false,

  webpack: config => {
    // eslint-disable-next-line no-param-reassign
    config.node = {
      console: true,
      fs: 'empty',
      net: 'empty',
      tls: 'empty'
    };

    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        'process.env.APPLICATIONS': JSON.stringify(process.env.APPLICATIONS),
        'process.env.BASEMAP_TILE_URL': JSON.stringify(process.env.BASEMAP_TILE_URL),
        'process.env.CALLBACK_URL': JSON.stringify(process.env.CALLBACK_URL),
        'process.env.CONTROL_TOWER_URL': JSON.stringify(process.env.CONTROL_TOWER_URL),
        'process.env.WRI_API_URL': JSON.stringify(process.env.WRI_API_URL),
        'process.env.STATIC_SERVER_URL': JSON.stringify(process.env.STATIC_SERVER_URL),
        'process.env.API_ENV': JSON.stringify(process.env.API_ENV)
      })
    );

    return config;
  }
});
