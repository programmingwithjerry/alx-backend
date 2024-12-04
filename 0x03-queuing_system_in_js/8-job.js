#!/usr/bin/yarn dev
// Shebang line to allow the script to be executed directly using "yarn dev" in a Node.js environment.

import { Queue, Job } from 'kue';
// Importing 'Queue' to handle job queues and 'Job' to interact with individual jobs.

export const createPushNotificationsJobs = (jobs, queue) => {
  // Function to create and manage push notification jobs.
  // Parameters:
  // - jobs: An array of job objects, each containing details for a push notification.
  // - queue: A Kue queue instance to which jobs will be added.

  if (!(jobs instanceof Array)) {
    // Validates that the input 'jobs' is an array. If not, an error is thrown.
    throw new Error('Jobs is not an array');
  }

  for (const jobInfo of jobs) {
    // Iterates over each job object in the 'jobs' array.

    const job = queue.create('push_notification_code_3', jobInfo);
    // Creates a job of type 'push_notification_code_3' using the current job's information.
    
    job
      .on('enqueue', () => {
        // Event listener triggered when the job is added to the queue.
        console.log('Notification job created:', job.id); // Logs the creation of the job with its ID.
      })
      .on('complete', () => {
        // Event listener triggered when the job is successfully completed.
        console.log('Notification job', job.id, 'completed'); // Logs the successful completion of the job.
      })
      .on('failed', (err) => {
        // Event listener triggered when the job fails.
        // Logs the failure of the job along with the error message.
        console.log('Notification job', job.id, 'failed:', err.message || err.toString());
      })
      .on('progress', (progress, _data) => {
        // Event listener triggered to report the progress of the job.
        // Parameters:
        // - progress: The percentage of completion (0–100).
        // - _data: Additional data related to progress (not used here).
        console.log('Notification job', job.id, `${progress}% complete`);
      });

    job.save();
    // Saves the job to the queue, making it ready for processing.
  }
};

export default createPushNotificationsJobs;
// Exports the function as the default export for use in other modules.
