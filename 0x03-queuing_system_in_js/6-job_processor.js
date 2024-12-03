#!/usr/bin/yarn dev
// Shebang line to allow the script to be executed directly with "yarn dev" in a Node.js environment.

import { createQueue } from 'kue';
// Importing the 'createQueue' function from the 'kue' library to create and manage a job queue.

const queue = createQueue();
// Creating an instance of a job queue. This queue will process jobs like sending notifications.

const sendNotification = (phoneNumber, message) => {
  // Function to simulate sending a notification.
  // Parameters:
  // - phoneNumber: The recipient's phone number.
  // - message: The notification message to be sent.

  console.log(
    `Sending notification to ${phoneNumber},`,
    'with message:',
    message,
  );
  // Logs the phone number and message to the console as if sending the notification.
};

queue.process('push_notification_code', (job, done) => {
  // Processing jobs of type 'push_notification_code' from the queue.
  // The callback is triggered when a job of this type is available for processing.
  // Parameters:
  // - job: The job object containing the data for the notification (phone number and message).
  // - done: A callback function that must be called once the job is completed.

  sendNotification(job.data.phoneNumber, job.data.message);
  // Calls the sendNotification function, passing in the phone number and message from the job data.
  
  done(); // Marks the job as complete, notifying the queue that the job has been processed.
});
