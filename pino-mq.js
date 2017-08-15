#!/usr/bin/env node

'use strict';

const path = require('path');
const fs = require('fs');
const split = require('split2');
const pump = require('pump');
const nopt = require('nopt');
const through = require('through2');
const pkgInfo = require('./package.json');

const defaultOptions = {
  type:         'RABBITMQ',
  uri:          '',
  exchange:     '',
  queue:        null,
  queuePattern: null,
  queueMap:     null,
  fields:       [],
  config:       null,
};

const longOptions = {
  type:         ['RABBITMQ'],
  uri:          String,
  exchange:     String,
  queue:        String,
  queuePattern: String,
  fields:       String,
  config:       String,
  help:         Boolean,
  version:      Boolean,
};

const shortOptions = {
  t:  '--type',
  u:  '--uri',
  e:  '--exchange',
  q:  '--queue',
  qp: '--queuePattern',
  f:  '--fields',
  c:  '--config',
  h:  '--help',
  v:  '--version',
};

const argv = nopt(longOptions, shortOptions, process.argv);
const configOptions = Object.assign({}, defaultOptions, argv);

if (configOptions.version) {
  console.log(pkgInfo.version);
  process.exit(0);
}

if (configOptions.help) {
  console.log(fs.readFileSync(path.join(__dirname, 'help.txt'), 'utf8'));
  process.exit(0);
}

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

