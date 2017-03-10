/**
 * Created by ronald on 3/10/17.
 */
/**
 * Created by ronald on 3/6/17.
 */
import chai from 'chai';
const should = chai.should();
import {validateRedisInput,getQueue,initQueue,getQueueName} from '../src/helpers'

describe('helpers', function () {

  describe('validateRedisInput', function () {
    it('should return false with no property port or host', () => {
      validateRedisInput({}).should.eqls(false)
    });
    it('should return false with redis wrong object schema', function () {
      validateRedisInput({port:3000,url:'/url'}).should.eqls(false)
    });
    it('should return redis config object if redis validation passes', function () {
      validateRedisInput({port:3000,host:'/url'}).should.eqls({port:3000,host:'/url'})
    });
  });

  describe.skip('prepareQueueParams',function(){
    it('should return false with no queue name', () => {
      prepareQueueParams(undefined).should.eqls(false)
    });
    it('should return false with no config object', () => {
      prepareQueueParams('test queue', false).should.eqls(false)
    });
    it('should return queue config object with proper inputs', () => {
      prepareQueueParams('test queue', {port: 6379, host: '127.0.0.1'}).should.eqls(
        {name: 'test queue', port: 6379, host: '127.0.0.1'}
      )
    });
    it('should return a list of queue config objects with list of names as inputs', () => {
      prepareQueueParams(['queue-1', 'queue-2', 'queue-3'], {port: 6379, host: '127.0.0.1'}).should.eql([
        {name: 'queue-1', port: 6379, host: '127.0.0.1'},
        {name: 'queue-2', port: 6379, host: '127.0.0.1'},
        {name: 'queue-3', port: 6379, host: '127.0.0.1'},
      ])
    });
  })

  describe('getQueue', function () {
    it('returns false when arguments are incomplete', () => {
      getQueue({}, 'hello').should.eqls(false)
    });

    it('returns false when arguments are incorrect', () => {
      getQueue('', {}).should.eqls(false)
    });

    it('returns false when name is empty string', () => {
      getQueue('', {}).should.eqls(false)
    });

    it('returns valid bull Queue object when arguments are correct', () => {
      getQueue({port: 6379, host: '127.0.0.1'}, 'test queue').should.have.property('keyPrefix', 'bull')
    });

  });

  describe('initQueue', function () {

    it.skip('should throw error with invalid config input', () => {
      console.log(initQueue('', {}))
      //(()=>initQueue('',{})).should().throw('Invalid config!')
      //(()=>initQueue('',{})).should.throw('Invalid config!');
    });

    it('should return a valid bull Queue process object with valid config', () => {
      const worker = (task) => Promise.resolve(1);
      const config = {port: 6379, host: '127.0.0.1'}
      initQueue('test queue', config,worker).should.have.property('_bitField')
    })


    it('should return multiple bull Queue processes when thrown a list of names', () => {
      const config = {port: 6379, host: '127.0.0.1'};
      const worker = (task) => Promise.resolve(1);
      initQueue(['test queue', 'test queue2'], config,worker).length.should.eqls(2)
    })
  });



  describe('getQueueName', function () {
    it('should return a default name if queue name is not given', () => {
      getQueueName().should.eqls('default Queue')
    });
    it('should return name from given name', () => {
      getQueueName('test queue').should.eqls('test queue')
    });
    it('roundrobin - returns a name from a list using roundrobin  ', () => {

    });
    it('random - returns a name from a list using random ', () => {
      const names=['name-1','name-2','name-3'];
      names.should.contain(getQueueName(['name-1','name-2','name-3']))
    });
  });



})
