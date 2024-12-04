#!/usr/bin/yarn dev
// Shebang line to allow the script to be executed directly using "yarn dev" in a Node.js environment.

import { createQueue, Job } from 'kue';
// Importing 'createQueue' to create a job queue and 'Job' for type and utility purposes.

const BLACKLISTED_NUMBERS = ['4153518780', '4153518781'];
// Array containing phone numbers that are blacklisted and should not receive notifications.

const queue = createQueue();
// Creating a queue instance to handle notification jobs.

const sendNotification = (phoneNumber, message, job, done) => {
  // Function to simulate sending a notification.
  // Parameters:
  // - phoneNumber: The recipient's phone number.
  // - message: The message to be sent.
  // - job: The job object representing the current job in the queue.
  // - done: A callback function to signal the completion or failure of the job.

  let total = 2; // Total steps required for progress simulation.
  let pending = 2; // Counter for pending steps.

  let sendInterval = setInterval(() => {
    // Simulates progress and notification sending at intervals of 1 second.

    if (total - pending <= total / 2) {
      // Updates the job's progress when less than or equal to 50% of the total steps are completed.
      job.progress(total - pending, total);
    }

    if (BLACKLISTED_NUMBERS.includes(phoneNumber)) {
      // Checks if the phone number is blacklisted.
      // If it is, marks the job as failed with an error and clears the interval.
      done(new Error(`Phone number ${phoneNumber} is blacklisted`));
      clearInterval(sendInterval);
      return; // Exits the function.
    }

    if (total === pending) {
      // Logs the notification details when the process begins.
      console.log(
        `Sending notification to ${phoneNumber},`,
        `with message: ${message}`,
      );
    }

    --pending || done();
    // Decrements the pending counter. If no pending steps remain, marks the job as completed.

    pending || clearInterval(sendInterval);
    // Stops the interval once all steps are completed.
  }, 1000);
};

queue.process('push_notification_code_2', 2, (job, done) => {
  // Processes jobs of type 'push_notification_code_2' with a concurrency level of 2.
  // The callback function is invoked for each job of this type in the queue.
  // Parameters:
  // - job: The job object containing data like phone number and message.
  // - done: Callback function to signal the job's completion or failure.

  sendNotification(job.data.phoneNumber, job.data.message, job, done);
  // Calls the sendNotification function to handle the notification logic.
});
