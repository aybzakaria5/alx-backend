import { createQueue } from 'kue';

// Create a Kue queue
const queue = createQueue();

// Job data
const jobData = {
  phoneNumber: '+254799456562',
  message: 'Registration successful',
};

// Create a job with the provided job data in the queue 'push_notification_code'
const job = queue.create('push notification code', jobData);

// Event listener for job creation
job
  .on('enqueue', () => {
    console.log('Job notification created:', job.id);
  })
  .on('complete', () => {
    console.log('Job notification completed');
  })
  .on('failed', () => {
    console.log('Job notification failed');
  });

// Save the job to the queue
job.save();
