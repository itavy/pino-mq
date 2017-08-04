#!/usr/bin/env node

'use strict';

const path = require('path');
const split = require('split2');
const pump = require('pump');
const through = require('through2');

// eslint-disable-next-line import/no-dynamic-require
const getMqTransport = require(path.join(__dirname, 'index')).getTransport;


const t = getMqTransport({
  type:            'RABBITMQ',
  transportParams: {
    uri: '',
  },
  exchange: '',
  queue:    'test-queue',
  // queuePattern,
  // queueMap,
  fields:   [],
});

process.stdin.on('close', t.close.bind(t));
process.on('SIGINT', t.close.bind(t));
process.on('SIGTERM', t.close.bind(t));

pump(
  t,
  split(JSON.parse),
  through.obj(t.write.bind(t), t.close.bind(t)));

