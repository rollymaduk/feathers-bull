import R from 'ramda';

import makeDebug from 'debug'; // eslint-disable-line

import toureiro from 'toureiro';

// const debug = makeDebug('feathers-bull');

import {initQueue, getQueue, getQueueName} from './helpers';

const defaultOptions = {
  redis: {port: 6379, host: '127.0.0.1'},
  toureiro: {db: 1, path: '/toureiro'}
};

export default function init (opts) {
  let options = R.merge(defaultOptions, opts);

  const workers = R.prop('workers');

  const redis = R.prop('redis', options);

  const configureQueues = R.curry((options) => {
    const {queues, worker} = options;
    return initQueue(queues, redis, worker);
  });

  const addTaskToWorker = R.curry((data, name) => {
    return getQueue(redis, getQueueName(name)).add(data);
  });

  return {
    setup (app, path) {
      /* initialize all queues and workers */
      R.compose(R.flatten, R.map(R.compose(configureQueues, R.last)), R.toPairs, workers)(options);

      /* setup toureiro ui for monitoring queues */
      if (!R.isEmpty(app)) { app.use(options.toureiro.path, toureiro({redis})); }
    },

    create ({name, data}) {
      /* create a new task for workers */
      return new Promise((resolve, reject) => {
        try {
          R.compose(addTaskToWorker(data), R.prop('queues'), R.prop(name), workers)(options);
          resolve(1);
        } catch (err) {
          reject(err);
        }
      });
    }
  };
}
