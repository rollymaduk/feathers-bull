/**
 * Created by ronald on 3/10/17.
 */
import Queue from 'bull'
import R from 'ramda'


const randomInt = (low, high) => {
  return Math.floor(Math.random() * (high - low) + low);
};

/*simple validation for redis inputs*/

export const validateRedisInput = (config) => {
  return R.is(Object, config) && R.and(R.has('port', config), R.has('host', config)) ? config : false
};


export const getQueue = R.curry((config, name) => {
  config = R.is(String, name) && R.not(R.isEmpty(name)) && validateRedisInput(config);
  return config ? Queue(name, R.prop('port', config), R.prop('host', config)) : false
});

/*setup a worker task for bull queue*/
export const setUpWorker = R.curry((worker,queue) => {
  /*todo validation for queue and worker vars*/
  return queue.process(worker)
});

/*configures a bull queue, sets up multiple queues when thrown a list of names*/
export const initQueue = R.curry((name, config, worker) => {
  return R.ifElse(R.isArrayLike, R.map(R.compose(setUpWorker(worker),getQueue(config)))
      , R.compose(setUpWorker(worker),getQueue(config)))(name) ||  new Error('Invalid config!')
});

/*returns a queue name from a list of task names for task assigment using either round robin or random*/
export const getQueueName = R.curry((name = 'default Queue', mode = 'rr') => {
  return R.ifElse(R.isArrayLike, (n) => n[randomInt(0, n.length)], n => n)(name)
});





