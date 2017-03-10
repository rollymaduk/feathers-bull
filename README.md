# feathers-bull

[![Greenkeeper badge](https://badges.greenkeeper.io/rollymaduk/feathers-bull.svg)](https://greenkeeper.io/)

[![Build Status](https://travis-ci.org/feathersjs/feathers-bull.png?branch=master)](https://travis-ci.org/feathersjs/feathers-bull)

> A simple feathers plugin for Bull, automatically sets up a monitoring
ui with toureiro at path /toureiro

## Usage
```js
const app = require('feathers')()
import QueueScheduler from 'feathers-bull';
const config={
  workers:{
    mail:{worker:function mailHanlder(job){
        return Promise((resolve,reject)=>{
          //do work and resolve
          resolve('mail sent')
          })
        }
      
    pdf:{worker: }
    }
   }
   redis: {port: 6379, host: '127.0.0.1'},//default
   toureiro:{db:1,path:'/toureiro'} //default
}

app.use('/bull',QueueScheduler(config))

```
## Example

```js
const feathers = require('feathers');
const rest = require('feathers-rest');
const socketio = require('feathers-socketio');
const bodyParser = require('body-parser');
const handler = require('feathers-errors/handler');
import QueueScheduler from 'feathers-bull';
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

```

## Changelog

- Initial release

## License

Copyright (c) 2017

Licensed under the [MIT license](LICENSE).
