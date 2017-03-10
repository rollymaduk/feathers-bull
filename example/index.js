/**
 * Created by ronald on 3/10/17.
 */
/**
 * Created by ronald on 3/9/17.
 */
const feathers = require('feathers');
const rest = require('feathers-rest');
const socketio = require('feathers-socketio');
const bodyParser = require('body-parser');
const handler = require('feathers-errors/handler');
import QueueScheduler from '../src/index';
const app =feathers()

const config = {
  workers: {
    myJob1: {
      queues: 'job-1-queue', worker: (job) => {
        return new Promise((resolve, reject) => {
          setTimeout(function myLongFunc() {
            resolve(job.data)
          },4000)
        }).then(res=>{
           /*send a message to job2 from 1*/
          app.service('bull').create({name:'myJob2',data:res});
          return res /*!important to always return*/
        })
      }
    },
    myJob2: {
      queues: ['job-2-queue-1','job-2-queue-2'], worker: (job) => {
        return new Promise((resolve, reject) => {
          setTimeout(function myLongFunc() {
            resolve(`Just recieved ${job.data} from myJob1`)
          },3000)
        })
      }
    }
  }
};



app.use(bodyParser.json())
  .use(bodyParser.urlencoded({extended: true}))
  .configure(rest())
  .configure(socketio())
  .use('/bull', QueueScheduler(config))
  .use('/', feathers.static(__dirname))
  .use(handler());

app.listen(3030,()=>{
  console.log('app is running at port 3030 with toureiro at /toureiro!')
});


setInterval(function () {
  app.service('/bull').create({name:'myJob1',data:'hello this is myJob1'});
}, 10000);
