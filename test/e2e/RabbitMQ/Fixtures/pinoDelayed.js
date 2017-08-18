'use strict';

const pino = require('pino')();
const { pinoTestMessages } = require('./index');

pinoTestMessages.map((el) => {
  if (!el.delayed) {
    pino[el.level](el.msg);
  } else {
    setTimeout(() => {
      pino[el.level](el.msg);
    }, 1000);
  }
  return true;
});
