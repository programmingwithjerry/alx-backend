const jobs = [
  {
    phoneNumber: '4153518780',
    message: 'This is the code 1234 to verify your account'
  },
  {
    phoneNumber: '4153518781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4153518743',
    message: 'This is the code 4321 to verify your account'
  },
  {
    phoneNumber: '4153538781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4153118782',
    message: 'This is the code 4321 to verify your account'
  },
  {
    phoneNumber: '4153718781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4159518782',
    message: 'This is the code 4321 to verify your account'
  },
  {
    phoneNumber: '4158718781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4153818782',
    message: 'This is the code 4321 to verify your account'
  },
  {
    phoneNumber: '4154318781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4151218782',
    message: 'This is the code 4321 to verify your account'
  }
];

const queue = createQueue({ name: 'push_notification_code_2' });
// Creating a job queue named 'push_notification_code_2'.
// This queue will handle jobs for sending push notifications.

for (const jobInfo of jobs) {
  // Iterating over the 'jobs' array, where each element contains information for a notification.
  // Each 'jobInfo' object includes data like the phone number and message to be sent.

  const job = queue.create('push_notification_code_2', jobInfo);
  // Creating a new job in the 'push_notification_code_2' queue.
  // The job is initialized with data from 'jobInfo'.

  job
    .on('enqueue', () => {
      // Event listener for the 'enqueue' event, triggered when the job is added to the queue.
      console.log('Notification job created:', job.id); // Logs the job ID when the job is enqueued.
    })
    .on('complete', () => {
      // Event listener for the 'complete' event, triggered when the job is processed successfully.
      console.log('Notification job', job.id, 'completed'); // Logs the success of the job.
    })
    .on('failed', (err) => {
      // Event listener for the 'failed' event, triggered when the job fails.
      // Logs the job ID and the error message for troubleshooting.
      console.log('Notification job', job.id, 'failed:', err.message || err.toString());
    })
    .on('progress', (progress, _data) => {
      // Event listener for the 'progress' event, triggered to report progress of the job.
      // Parameters:
      // - progress: Percentage of job completion (0–100).
      // - _data: Optional additional data (not used in this example).
      console.log('Notification job', job.id, `${progress}% complete`);
    });

  job.save();
  // Saves the job to the queue, making it available for processing.
}
