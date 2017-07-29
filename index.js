'use strict';

const semver = require('semver');

/**
 * Lazy load es6 module
 * @returns {Object} es6 pino-mq module
 */
const getES6Module = () => require('./lib/index'); // eslint-disable-line global-require

/**
 * load module for current version of node
 * @param {Object} getParams conditions for loading module
 * @param {String} getParams.nodeVersion current verion of node
 * @returns {Object} messages-generator module
 */
const getModule = (getParams) => {
  if (semver.gte(getParams.nodeVersion, 'v6.9.1')) {
    return getES6Module();
  }

  throw new Error(`Invalid node version: ${getParams.nodeVersion}`);
};

module.exports = getModule({ nodeVersion: process.version });
