[![Build Status](https://travis-ci.org/itavy/pino-mq.svg?branch=initial_release)](https://travis-ci.org/itavy/pino-mq)
# pino-mq
Pino-mq will take all messages received on process.stdin and send them over a message bus using JSON serialization;

## Installation

```
npm install -g pino-mq
```

## Quick Example
```
node app.js | pino-mq -u "amqp://guest:guest@localhost/" -q "pino-logs"
```


## Command line switches

- `--type` (`-t`): MQ type of transport to be used (default 'RABBITMQ')
- `--uri` (`-u`): uri for connecting to MQ broker
- `--queue` (`-q`): queue to be used for sending messages
- `--queuePattern` (`-qp`): queuePattern  to be used for sending messages
- `--fields` (`-f`): comma separated fields for filtering messages before sending
- `--exchange` (`-e`): exchange name to be used in case of rabbitmq transport
- `--config` (`-c`): path to config file (JSON); switches take precedence
- `--generateConfig` (`-g`): create pino-mq.json config file with default options
- `--help` (`-h`): display help
- `--version` (`-v`): display version

## Configuration JSON File
by using `--generateConfig` it will create `pino-mq.json` file with all available configuration 
options; `queueMap` option is available only in configuration json file;

```
{
 "type": "RABBITMQ",
 "uri": "amqp://guest:guest@localhost/",
 "exchange": "",
 "queue": "pino-mq",
 "queuePattern": null,
 "queueMap": null,
 "fields": []
}
```

## Queues configuration
queue configuration has a priority in defining behaviour for pino-mq; if more than one is specified, configuration will take this precedence:

1. `queue` all messages will be sent on this queue
2. `queuePattern` all messages will be sent on queue based on their message level; corespondig queue will be `<queuePattern><messageLevel>`:
    * ex: 
        ```
        queuePattern: 'pino-mq-
        ```
        message:
        ```
        {"pid":25793,"hostname":"localhost.localdomain","level":50,"time":1503252634289,"msg":"msg3","v":1}
        ```
        will be routed to `pino-mq-50` queue;
3. `queueMap` option allows you to specify specific queues based on their message level:
    ```
    queueMap: {
      default: 'pino-mq-default',
      '30': 'infoMessages',
      '40': 'warnMessages',
      '50': 'errorMessages', 
    }
    ```
    all info messages will be sent on `infoMessages` queue, warn on `warnMessages` and errors on `errorMessages`;
    * `default` option will match any other messages where their level will not match anything in the map; this key is mandatory;

#### RabbitMQ specific options
For RabbitMQ type there is an extra option: 
* `--exchange`: if you want to use a specific exchange for your queues or you want to use topics instead of queues than you have to pass it to pino-mq configuration; topics are a more powerful distribution mechanism than queues and explaining it is beyond the scope of this module; (for reference [RabbitMQ Topics tutorial](https://www.rabbitmq.com/tutorials/tutorial-five-javascript.html)


## Fields filtering
in case is needed to filter log messages fields you can use fields option:
* from command line:
    * `--fields "time,level,msg"`
* from configuration json file:
    * `"fields":["time","level","msg"]`

## TODO
* [ ] add Redis transport
* [ ] add NATS transport
* [ ] add documentation on how to use this module as dependency

## LICENSE
[MIT License](https://github.com/itavy/pino-mq/blob/master/LICENSE.md)
