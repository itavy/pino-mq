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
  uri:          null,
  exchange:     '',
  queue:        null,
  queuePattern: null,
  queueMap:     null,
  fields:       null,
  config:       null,
};

const longOptions = {
  type:           ['RABBITMQ'],
  uri:            String,
  exchange:       String,
  queue:          String,
  queuePattern:   String,
  fields:         String,
  config:         String,
  help:           Boolean,
  version:        Boolean,
  generateConfig: Boolean,
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
  g:  '--generateConfig',
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

if (configOptions.generateConfig) {
  const cfgSample = JSON.stringify({
    type:         'RABBITMQ',
    uri:          'amqp://guest:guest@localhost/',
    exchange:     '',
    queue:        'pino-mq',
    queuePattern: null,
    queueMap:     null,
    fields:       [],
  }, null, ' ');
  fs.writeFileSync('pino-mq.json', cfgSample);
  console.log('Configuration is written in file "pino-mq.json"');
  console.log('You can use now:');
  console.log('\n\nnode script.js | pino-mq -c pino-mq.json\n\n');
  process.exit(0);
}

if (configOptions.fields && (configOptions.fields.length !== 0)) {
  configOptions.fields = configOptions.fields.split(',');
}

if (configOptions.config !== null) {
  try {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const cfgFile = require(path.resolve(configOptions.config));
    Object.keys(configOptions).map((key) => {
      if (configOptions[key]) {
        return null;
      }
      if (cfgFile[key]) {
        configOptions[key] = cfgFile[key];
      }
      return null;
    });
  } catch (e) {
    console.log(`Error loading config file: ${e.message}`);
    process.exit(1);
  }
}

if (configOptions.uri === null) {
  console.log('You must specify connection uri');
  process.exit(1);
}


// process.exit(0);

// eslint-disable-next-line import/no-dynamic-require
const getMqTransport = require(path.join(__dirname, 'index')).getTransport;


const t = getMqTransport({
  type:            configOptions.type,
  transportParams: {
    uri: configOptions.uri,
  },
  exchange:     configOptions.exchange,
  queue:        configOptions.queue,
  queuePattern: configOptions.queuePattern,
  queueMap:     configOptions.queueMap,
  fields:       configOptions.fields,
});

process.stdin.on('close', () => {
  console.log('STDIN CLOSE');
  t.close();
});
// process.on('SIGINT', t.close.bind(t));
process.on('SIGINT', () => {
  console.log('SIGINT CLOSE');
  t.close();
});
process.on('SIGTERM', () => {
  console.log('SIGTERM CLOSE');
  t.close();
});

pump(
  process.stdin,
  split(JSON.parse),
  through.obj(t.write.bind(t)));
// through.obj(t.write.bind(t), t.close.bind(t)));
