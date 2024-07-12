import { createQueue } from 'kue';

// Array of blacklisted phone numbers
const BLACKLISTED_NUMBERS = ['4153518780', '4153518781'];

// Create a Kue queue
const queue = createQueue();

/**
 * Sends a notification if the phone number is not blacklisted.
 * Tracks the job's progress and logs the status.
 * 
 * @param {String} phoneNumber - The phone number to send the notification to.
 * @param {String} message - The message to send.
 * @param {Object} job - The job object.
 * @param {Function} done - The callback function to mark the job as done.
 */
const sendNotification = (phoneNumber, message, job, done) => {
  // Track job progress
  job.progress(0, 100);

  // Check if the phone number is blacklisted
  if (BLACKLISTED_NUMBERS.includes(phoneNumber)) {
    return done(new Error(`Phone number ${phoneNumber} is blacklisted`));
  }

  // Track job progress to 50%
  job.progress(50, 100);
  
  // Log the notification message
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);

  // Track job progress to 100%
  job.progress(100, 100);
  
  // Mark the job as done
  done();
};

// Process jobs in the queue 'push_notification_code_2' with a concurrency of 2
queue.process('push_notification_code_2', 2, (job, done) => {
  sendNotification(job.data.phoneNumber, job.data.message, job, done);
});
