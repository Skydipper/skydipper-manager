import { get, post } from 'utils/request';
import WRISerializer from 'wri-json-api-serializer';

// utils
import { WRIAPI } from 'utils/axios';
import { logger } from 'utils/logs';

export default class LayersService {
  constructor(options = {}) {
    this.opts = options;
  }

  saveData({ type, body, id, dataset }) {
    return new Promise((resolve, reject) => {
      post({
        url: `${process.env.WRI_API_URL}/dataset/${dataset}/layer/${id}`,
        type,
        body,
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json',
          },
          {
            key: 'Authorization',
            value: this.opts.authorization,
          },
        ],
        onSuccess: response => {
          resolve({
            ...response.data.attributes,
            id: response.data.id,
          });
        },
        onError: error => {
          reject(error);
        },
      });
    });
  }
}

/**
 * Fetchs layers
 * @param {string} token The user's token
 * @param {boolean} includeMeta Whether to return the meta information
 * @param {string} datasetId Only fetch the layers of that dataset
 * @param {any} params Query params to send to the API
 */
export const fetchLayers = (token, includeMeta, datasetId, params = {}) => {
  logger.info('fetches layers');

  return WRIAPI.get(datasetId ? `/dataset/${datasetId}/layer` : '/layer', {
    headers: {
      ...WRIAPI.defaults.headers,
      // TO-DO: forces the API to not cache, this should be removed at some point
      'Upgrade-Insecure-Requests': 1,
      ...(token ? { Authorization: token } : {}),
    },
    params: {
      env: process.env.API_ENV,
      ...params,
    },
    transformResponse: [].concat(WRIAPI.defaults.transformResponse, ({ data, meta }) => ({
      layers: data,
      meta,
    })),
  })
    .then(response => {
      const { status, statusText, data } = response;
      const { layers, meta } = data;

      if (status >= 300) {
        logger.error('Error fetching layers:', `${status}: ${statusText}`);
        throw new Error(statusText);
      }

      if (includeMeta) {
        return {
          layers: WRISerializer({ data: layers }),
          meta,
        };
      }

      return WRISerializer({ data: layers });
    })
    .catch(response => {
      const { status, statusText } = response;

      logger.error(`Error fetching layers: ${status}: ${statusText}`);
      throw new Error(`Error fetching layers: ${status}: ${statusText}`);
    });
};

/**
 * Fetch a layer
 * @param {string} id Layer ID
 * @param {string} token User's token
 * @param {object} params Additional params to send
 */

export const fetchLayer = (id, token, params = {}) => {
  if (!id) throw Error('layer id is mandatory to perform this fetching.');
  logger.info(`Fetches layer: ${id}`);

  return WRIAPI.get(`/layer/${id}`, {
    headers: {
      ...WRIAPI.defaults.headers,
      // TO-DO: forces the API to not cache, this should be removed at some point
      'Upgrade-Insecure-Requests': 1,
      Authorization: token,
    },
    params: {
      application: process.env.APPLICATIONS,
      ...params,
    },
    transformResponse: [].concat(WRIAPI.defaults.transformResponse, ({ data }) => data),
  })
    .then(response => {
      const { status, statusText, data } = response;

      if (status >= 300) {
        if (status === 404) {
          logger.debug(`Layer '${id}' not found, ${status}: ${statusText}`);
        } else {
          logger.error('Error fetching layer:', `${status}: ${statusText}`);
        }
        throw new Error(statusText);
      }
      return WRISerializer({ data });
    })
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error('Error fetching layer:', `${status}: ${statusText}`);
      throw new Error('Error fetching layer:', `${status}: ${statusText}`);
    });
};

/**
 * Deletes a specified layer.
 * This fetch needs authentication.
 *
 * @param {*} id - layer ID to be deleted.
 * @param {string} token - user's token.
 * @returns {Object} fetch response.
 */
export const deleteLayer = (layerId, datasetId, token) => {
  logger.info(`deletes layer: ${layerId}`);

  return WRIAPI.delete(`/dataset/${datasetId}/layer/${layerId}`, {
    headers: {
      ...WRIAPI.defaults.headers,
      Authorization: token,
    },
  })
    .then(response => {
      const { status, statusText } = response;

      if (status >= 300) {
        if (status === 404) {
          logger.debug(`Layer '${layerId}' not found, ${status}: ${statusText}`);
        } else {
          logger.error(`Error deleting layer: ${layerId}: ${status}: ${statusText}`);
        }
        throw new Error(statusText);
      }
      return response;
    })
    .catch(({ response }) => {
      const { status, statusText } = response;

      logger.error(`Error deleting layer ${layerId}: ${status}: ${statusText}`);
      throw new Error(`Error deleting layer ${layerId}: ${status}: ${statusText}`);
    });
};
