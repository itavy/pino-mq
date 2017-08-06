#!/usr/bin/env bash
MQ_USER="guest";
MQ_PASS="guest";
MQ_HOST="localhost";
MQ_VHOST="/";

MQ_EXCHANGE="pinoMQExchange";

CMD_DECLARE="rabbitmqadmin -u \"$MQ_USER\" -p \"$MQ_PASS\" --vhost=\"$MQ_VHOST\" declare"

# QUEUES
# queue for testing
${CMD_DECLARE} queue name="pino-mq-queue" durable=true

# pattern queue for testing
${CMD_DECLARE} queue name="pino-mq-queue-30" durable=true
${CMD_DECLARE} queue name="pino-mq-queue-35" durable=true

# queue maps
${CMD_DECLARE} queue name="pinomqqueue-30" durable=true
${CMD_DECLARE} queue name="pinomqqueue-40" durable=true
${CMD_DECLARE} queue name="pinomqqueue-default" durable=true


# TOPICS

${CMD_DECLARE} exchange name="$MQ_EXCHANGE" type="topic";

# topic for testing
MQ_TOPIC_QUEUE="pino-mq-queue-topic";
MQ_TOPIC="pinoMQTopic";

${CMD_DECLARE} queue  name="$MQ_TOPIC_QUEUE" durable=true
${CMD_DECLARE} binding source="$MQ_EXCHANGE" destination_type="queue" \
  destination="$MQ_TOPIC_QUEUE" routing_key="$MQ_TOPIC";


# pattern topic for testing
MQ_TOPIC_QUEUE1="pino-mq-patternqueue-topic-1";
MQ_TOPIC_QUEUE2="pino-mq-patternqueue-topic-2";
MQ_TOPIC_QUEUE3="pino-mq-patternqueue-topic-3";
MQ_TOPIC1="pinoMQTopic.30";
MQ_TOPIC2="pinoMQTopic.35";
MQ_TOPIC3="pinoMQTopic.*";

${CMD_DECLARE} queue  name="$MQ_TOPIC_QUEUE1" durable=true
${CMD_DECLARE} binding source="$MQ_EXCHANGE" destination_type="queue" \
  destination="$MQ_TOPIC_QUEUE1" routing_key="$MQ_TOPIC1";

${CMD_DECLARE} queue  name="$MQ_TOPIC_QUEUE2" durable=true
${CMD_DECLARE} binding source="$MQ_EXCHANGE" destination_type="queue" \
  destination="$MQ_TOPIC_QUEUE2" routing_key="$MQ_TOPIC2";

${CMD_DECLARE} queue  name="$MQ_TOPIC_QUEUE3" durable=true
${CMD_DECLARE} binding source="$MQ_EXCHANGE" destination_type="queue" \
  destination="$MQ_TOPIC_QUEUE3" routing_key="$MQ_TOPIC3";

# topic maps

MQ_TOPIC_QUEUE1="pino-mq-mapqueue-topic-1";
MQ_TOPIC_QUEUE2="pino-mq-mapqueue-topic-2";
MQ_TOPIC_QUEUE3="pino-mq-mapqueue-topic-3";
MQ_TOPIC1="pinoMQ.Topic.30";
MQ_TOPIC2="pinoMQ.Topic.default";
MQ_TOPIC3="pinoMQ.Topic.*";

${CMD_DECLARE} queue  name="$MQ_TOPIC_QUEUE1" durable=true
${CMD_DECLARE} binding source="$MQ_EXCHANGE" destination_type="queue" \
  destination="$MQ_TOPIC_QUEUE1" routing_key="$MQ_TOPIC1";

${CMD_DECLARE} queue  name="$MQ_TOPIC_QUEUE2" durable=true
${CMD_DECLARE} binding source="$MQ_EXCHANGE" destination_type="queue" \
  destination="$MQ_TOPIC_QUEUE2" routing_key="$MQ_TOPIC2";

${CMD_DECLARE} queue  name="$MQ_TOPIC_QUEUE3" durable=true
${CMD_DECLARE} binding source="$MQ_EXCHANGE" destination_type="queue" \
  destination="$MQ_TOPIC_QUEUE3" routing_key="$MQ_TOPIC3";
