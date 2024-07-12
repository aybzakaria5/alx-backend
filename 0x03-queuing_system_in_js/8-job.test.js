import { expect } from 'chai';
import kue from 'kue';
import sinon from 'sinon';
import createPushNotificationsJobs from './8-job.js';

describe('createPushNotificationsJobs', () => {
  let queue;
  let consoleSpy;

  before(() => {
    queue = kue.createQueue();
    queue.testMode.enter(true); // Enter test mode
  });

  after(() => {
    queue.testMode.exit(); // Exit test mode
  });

  beforeEach(() => {
    consoleSpy = sinon.spy(console, 'log');
  });

  afterEach(() => {
    queue.testMode.clear(); // Clear the queue
    console.log.restore();
  });

  it('displays an error message if jobs is not an array', () => {
    expect(() => {
      createPushNotificationsJobs({}, queue);
    }).to.throw('Jobs is not an array');
  });

  it('creates two new jobs to the queue', () => {
    const jobs = [
      {
        phoneNumber: '44556677889',
        message: 'Use the code 1982 to verify your account',
      },
      {
        phoneNumber: '98877665544',
        message: 'Use the code 1738 to verify your account',
      },
    ];

    createPushNotificationsJobs(jobs, queue);

    expect(queue.testMode.jobs.length).to.equal(2);
    expect(queue.testMode.jobs[0].data).to.deep.equal(jobs[0]);
    expect(queue.testMode.jobs[0].type).to.equal('push_notification_code_3');
    expect(queue.testMode.jobs[1].data).to.deep.equal(jobs[1]);
    expect(queue.testMode.jobs[1].type).to.equal('push_notification_code_3');

    expect(consoleSpy.calledWith('Notification job created:', 1)).to.be.true;
    expect(consoleSpy.calledWith('Notification job created:', 2)).to.be.true;
  });

  it('registers the progress event handler for a job', (done) => {
    const jobs = [
      {
        phoneNumber: '44556677889',
        message: 'Use the code 1982 to verify your account',
      },
    ];

    createPushNotificationsJobs(jobs, queue);

    const job = queue.testMode.jobs[0];
    job.on('progress', (progress) => {
      expect(progress).to.equal(25);
      expect(consoleSpy.calledWith(`Notification job ${job.id} 25% complete`)).to.be.true;
      done();
    });

    job.progress(25, 100);
  });

  it('registers the failed event handler for a job', (done) => {
    const jobs = [
      {
        phoneNumber: '44556677889',
        message: 'Use the code 1982 to verify your account',
      },
    ];

    createPushNotificationsJobs(jobs, queue);

    const job = queue.testMode.jobs[0];
    job.on('failed', (error) => {
      expect(error.message).to.equal('Failed to send');
      expect(consoleSpy.calledWith(`Notification job ${job.id} failed: Failed to send`)).to.be.true;
      done();
    });

    job.failed(new Error('Failed to send'));
  });

  it('registers the complete event handler for a job', (done) => {
    const jobs = [
      {
        phoneNumber: '44556677889',
        message: 'Use the code 1982 to verify your account',
      },
    ];

    createPushNotificationsJobs(jobs, queue);

    const job = queue.testMode.jobs[0];
    job.on('complete', () => {
      expect(consoleSpy.calledWith(`Notification job ${job.id} completed`)).to.be.true;
      done();
    });

    job.complete();
  });
});
