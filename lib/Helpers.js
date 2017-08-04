'use strict';

const fastSafeStringify = require('fast-safe-stringify');

/**
 * Serialize JSON
 * @param {Object} obj object to be serialized JSON
 * @returns {String} JSON representation of the object
 */
const tryStringify = (obj) => {
  try { return JSON.stringify(obj); } catch (_) { /* do nothing */ }
  return fastSafeStringify(obj);
};


/**
 * Validate Mq Settings
 * @param {String} queue queue for distributing messages
 * @param {String} queuePattern queue pattern for distributing messages
 * @param {Object} queueMap queue map for distributing messages
 * @returns {Boolean} if validation fails it will throw an error
 */
const validateMqSettings = ({ queue = null, queuePattern = null, queueMap = null }) => {
  if (!queue && !queuePattern && !queueMap) {
    throw Error('You must provide at least queue or queuePatern or queueMap.');
  }
  return true;
};

module.exports = {
  tryStringify,
  validateMqSettings,
};
