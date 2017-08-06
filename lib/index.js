'use strict';

const amqpLib = require('amqplib');

const { tryStringify, validateMqSettings } = require('./Helpers');

const RabbitMQTransport = require('./RabbitMQTransport').RabbitMQTransport;
const MQTransport = require('./MQTransport').MQTransport;

/**
 * Get transport type
 * @param {String} type transport type
 * @param {*} params specific transport parameters
 * @returns {Object} transport to be used
 */
const getTransportByType = (type, params) => {
  if (type === 'RABBITMQ') {
    return Reflect.construct(RabbitMQTransport, [
      Object.assign({}, params, {
        stringify: tryStringify,
        amqpLib,
      }),
    ]);
  }
  throw Error(`Unknown transport type requested: ${type}.`);
};

/**
 * get transport
 * @param {String} type transport type
 * @param {Object} transportParams transport parameters
 * @param {String} [exchange=''] exchange to be used for sending messages
 * @param {String} [queue=null] queue for distributing messages
 * @param {String} [queuePattern=null] queue pattern for distributing messages
 * @param {Object} [queueMap=null] queue map for distributing messages
 * @param {String[]} [fields=[]] message fields to be send over transport
 * @returns {MQTransport} instantiated transport
 */
const getTransport = ({ type, transportParams, exchange = '', queue = null, queuePattern = null, queueMap = null, fields = [] }) => {
  validateMqSettings({ queue, queuePattern, queueMap });
  return Reflect.construct(MQTransport, [
    {
      transport: getTransportByType(type, transportParams),
      exchange,
      queue,
      queuePattern,
      queueMap,
      fields,
    },
  ]);
};

module.exports = {
  getTransport,
};
