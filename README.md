# skydipper-manager

skydipper-manager is a web application, acting as a back-office for the [Skydipper API](http://developer.skydipper.com/index.html).

## Getting Started

In order to run the server locally, make sure you have [Node.js](https://nodejs.org/en/) installed.

Optionally, you can also install [Yarn](https://yarnpkg.com/en/) instead of npm (which comes bundled with Node.js).

Then, clone the repository and install the dependencies:

```bash
$ git clone https://github.com/Skydipper/skydipper-manager.git
$ cd skydipper-manager

# When using npm
$ npm install

# When using Yarn
$ yarn
```

Duplicate the `.env.sample` file and rename it `.env`:
```bash
$ cp .env.sample .env
```

Check the "Environment variables" section below to learn more about how to configure them.

Finally, to run the server, type:

```bash
$ npm run dev

# ... or with Yarn
$ yarn dev
```

## Environment variables

The `.env` file contains environment variables that are used by the server and app. Here's the list of them and what they are used for:

| Name | Default value | Description |
|------|---------------|-------------|
| CONTROL_TOWER_URL | https://production-api.globalforestwatch.org | URL of the [Control tower](https://github.com/control-tower/control-tower) service
| CALLBACK_URL | | Callback URL once the authentication has been handled by Control tower
| REDIS_URL | | URL of the [Redis](https://redis.io/) database used to store the sessions (production only)
| WRI_API_URL | https://api.skydipper.com/v1 | URL of the API
| APPLICATIONS | skydipper | Name of the application in the API (see [here](http://developer.skydipper.com/index.html#dataset) for examples)
| API_ENV | production | Name of the environment in the API (see [here](http://developer.skydipper.com/index.html#dataset) for examples) |
| BASEMAP_TILE_URL | | URL of a tile service (see [here](https://leaflet-extras.github.io/leaflet-providers/preview/) for examples) |


## Contributing

If you'd like to contribute, please make sure you're using a text editor that is configured to work with:

-   [EditorConfig](https://editorconfig.org/)
-   [ESlint](https://eslint.org/)
-   [Prettier](https://prettier.io/)

All these tools take care of the formatting and maintain the consistency of the code.

## Changelog

Please have a look at [CHANGELOG.md](https://github.com/Skydipper/skydipper-manager/blob/develop/CHANGELOG.md).

## License

This project is licensed under the MIT License. See the [LICENSE.md](LICENSE.md) file for details.
