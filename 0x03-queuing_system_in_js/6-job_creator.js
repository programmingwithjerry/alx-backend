#!/usr/bin/yarn dev
// Shebang line to allow the script to be executed directly with "yarn dev" in a Node.js environment.

import { createQueue } from 'kue';
// Importing the 'createQueue' function from the 'kue' library to create and manage a job queue.

const queue = createQueue({ name: 'push_notification_code' });
// Creating a job queue with the name 'push_notification_code'.
// This queue will handle jobs related to sending push notifications.

const job = queue.create('push_notification_code', {
  // Creating a new job in the 'push_notification_code' queue.
  // The job contains data required for sending a push notification.
  phoneNumber: '08115309345', // The recipient's phone number.
  message: 'Account registered', // The message to be sent.
});

job
  .on('enqueue', () => {
    // Event listener for the 'enqueue' event, triggered when the job is added to the queue.
    console.log('Notification job created:', job.id); // Logs the job ID when it's created.
  })
  .on('complete', () => {
    // Event listener for the 'complete' event, triggered when the job finishes successfully.
    console.log('Notification job completed'); // Logs a success message.
  })
  .on('failed attempt', () => {
    // Event listener for the 'failed attempt' event, triggered when the job fails during an attempt.
    console.log('Notification job failed'); // Logs a failure message.
  });

job.save();
// Saves the job to the queue, making it ready to be processed.
