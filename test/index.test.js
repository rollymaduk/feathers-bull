import assert from 'assert';
import plugin from '../src';
import sinon from 'sinon';
import chai from 'chai';
const should = chai.should(); // eslint-disable-line
const sandbox = sinon.sandbox.create();
import queueManager from '../src/index';

describe('pdfdocgen', () => {
  describe('init', () => {
    const mockedTask = (job) => {
      return Promise.resolve(job.data);
    };

    const opts = {
      workers: {
        google: {queues: ['g-queue-1', 'g-queue-2'], worker: mockedTask, mode: 'rr'},
        s3: {queues: ['s3-queue-1', 's3-queue-2'], worker: mockedTask, mode: 'rr'}
      },
      redis: {port: 6379, host: '127.0.0.1'}

    };

    const initQueueSpy = sandbox.spy();
    const modkedApp = sandbox.stub({
      use: () => {
      },
      service: () => {
      }
    });

    beforeEach(() => {
      queueManager.__Rewire__('initQueue', initQueueSpy);
    });

    afterEach(() => {
      queueManager.__ResetDependency__('initQueue');
    });

    after(() => {
      sandbox.restore();
    });

    it('should add workers at setup when given workers', () => {
      queueManager(opts).setup(modkedApp, '/');
      assert(initQueueSpy.calledTwice);
      initQueueSpy.getCall(1).args[0].should.eql(['s3-queue-1', 's3-queue-2']);
      assert(typeof initQueueSpy.getCall(1).args[2] === 'function');
    });

    it('should add new job to queue', (done) => {
      queueManager.__ResetDependency__('initQueue');
      queueManager(opts).create({name: 'google', data: {text: 'howdy', span: 2000}})
        .then(res => {
          res.should.eqls(1);
          done();
        });
    });
    it('should setup monitoring ui', () => {
      queueManager(opts).setup(modkedApp, '/');
      assert(modkedApp.use.calledWith('/toureiro'));
    });
  });

  it('is CommonJS compatible', () => {
    assert.equal(typeof require('../lib'), 'function');
  });

  it('basic functionality', done => {
    assert.equal(typeof plugin, 'function', 'It worked');
    done();
  });
});
