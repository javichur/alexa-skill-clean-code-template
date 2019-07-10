/* eslint-disable  no-console */
const Https = require('https');
const Url = require('url');
const Settings = require('../settings.js');

module.exports = {
  /**
   * API call sample.
   */
  getInfoAPI() {
    const urlApi = Settings.URL_API;
    const headers = {
      Accept: 'application/json',
    };

    return this.httpGeneric(urlApi, 'GET', headers).then((data) => {
      if (!data) {
        return []; // no hay datos
      }

      // datos devueltos por api
      return data;
    }).catch((err) => {
      console.log(`err: ${err}`);
      return null;
    });
  },

  httpGeneric(urlApi, method, headers) {
    const parsedUrl = Url.parse(urlApi);

    return new Promise(((resolve, reject) => {
      const options = {
        host: parsedUrl.hostname,
        path: parsedUrl.path,
        method,
      };

      options.port = (parsedUrl.protocol === 'https:') ? 443 : 80;

      if (headers != null) {
        options.headers = headers;
      }

      const request = Https.request(options, (response) => {
        let returnData = '';

        response.on('data', (chunk) => {
          returnData += chunk;
        });

        response.on('end', () => {
          resolve(returnData);
        });

        response.on('error', (error) => {
          console.log(`error httpGeneric: ${error}`);
          reject(error);
        });
      });
      request.end();
    }));
  },
};
