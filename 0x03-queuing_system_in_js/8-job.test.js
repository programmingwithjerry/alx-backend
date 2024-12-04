#!/usr/bin/yarn test
// Shebang line to execute the test file directly using "yarn test".

import sinon from 'sinon';
// Imports Sinon for creating spies, stubs, and mocks.

import { expect } from 'chai';
// Imports Chai for writing assertions in tests.

import { createQueue } from 'kue';
// Imports the Kue library for creating and managing job queues.

import createPushNotificationsJobs from './8-job.js';
// Imports the function being tested from the specified module.

describe('createPushNotificationsJobs', () => {
  // Main test suite for the createPushNotificationsJobs function.

  const BIG_BROTHER = sinon.spy(console);
  // Creates a Sinon spy to monitor and track console.log calls.

  const QUEUE = createQueue({ name: 'push_notification_code_test' });
  // Creates a Kue queue instance for testing, with a custom name for clarity.

  before(() => {
    // Runs once before all tests in this suite.
    QUEUE.testMode.enter(true);
    // Enables Kue's test mode, preventing actual job processing.
  });

  after(() => {
    // Runs once after all tests in this suite.
    QUEUE.testMode.clear();
    // Clears all queued jobs in test mode.
    QUEUE.testMode.exit();
    // Exits Kue's test mode.
  });

  afterEach(() => {
    // Runs after each individual test.
    BIG_BROTHER.log.resetHistory();
    // Resets the history of the Sinon spy to ensure logs from previous tests don't interfere.
  });

  it('displays an error message if jobs is not an array', () => {
    // Test to verify that the function throws an error if the input is not an array.
    expect(
      createPushNotificationsJobs.bind(createPushNotificationsJobs, {}, QUEUE)
    ).to.throw('Jobs is not an array');
    // Checks that calling the function with an invalid argument throws the correct error message.
  });

  it('adds jobs to the queue with the correct type', (done) => {
    // Test to ensure jobs are correctly added to the queue.
    expect(QUEUE.testMode.jobs.length).to.equal(0);
    // Ensures the queue is initially empty.

    const jobInfos = [
      {
        phoneNumber: '44556677889',
        message: 'Use the code 1982 to verify your account',
      },
      {
        phoneNumber: '98877665544',
        message: 'Use the code 1738 to verify your account',
      },
    ];
    // Example job data to be added to the queue.

    createPushNotificationsJobs(jobInfos, QUEUE);
    // Calls the function to add jobs to the queue.

    expect(QUEUE.testMode.jobs.length).to.equal(2);
    // Verifies that two jobs have been added to the queue.

    expect(QUEUE.testMode.jobs[0].data).to.deep.equal(jobInfos[0]);
    // Ensures the first job's data matches the input data.

    expect(QUEUE.testMode.jobs[0].type).to.equal('push_notification_code_3');
    // Ensures the job type is correctly set.

    QUEUE.process('push_notification_code_3', () => {
      // Simulates processing the jobs in the queue.
      expect(
        BIG_BROTHER.log
          .calledWith('Notification job created:', QUEUE.testMode.jobs[0].id)
      ).to.be.true;
      // Verifies that the correct log message was generated.
      done();
    });
  });

  it('registers the progress event handler for a job', (done) => {
    // Test to verify that the progress event is handled correctly.
    QUEUE.testMode.jobs[0].addListener('progress', () => {
      expect(
        BIG_BROTHER.log
          .calledWith('Notification job', QUEUE.testMode.jobs[0].id, '25% complete')
      ).to.be.true;
      // Verifies that the correct progress message was logged.
      done();
    });
    QUEUE.testMode.jobs[0].emit('progress', 25);
    // Simulates a progress event with 25% completion.
  });

  it('registers the failed event handler for a job', (done) => {
    // Test to verify that the failed event is handled correctly.
    QUEUE.testMode.jobs[0].addListener('failed', () => {
      expect(
        BIG_BROTHER.log
          .calledWith('Notification job', QUEUE.testMode.jobs[0].id, 'failed:', 'Failed to send')
      ).to.be.true;
      // Verifies that the correct failure message was logged.
      done();
    });
    QUEUE.testMode.jobs[0].emit('failed', new Error('Failed to send'));
    // Simulates a failure event with an error message.
  });

  it('registers the complete event handler for a job', (done) => {
    // Test to verify that the complete event is handled correctly.
    QUEUE.testMode.jobs[0].addListener('complete', () => {
      expect(
        BIG_BROTHER.log
          .calledWith('Notification job', QUEUE.testMode.jobs[0].id, 'completed')
      ).to.be.true;
      // Verifies that the correct completion message was logged.
      done();
    });
    QUEUE.testMode.jobs[0].emit('complete');
    // Simulates a completion event.
  });
});
