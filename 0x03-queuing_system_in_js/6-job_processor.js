import { createQueue } from 'kue';

// Create a Kue queue
const queue = createQueue();

// Function to send notification
const sendNotification = (phoneNumber, message) => {
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
};

// Process jobs from the 'push_notification_code' queue
queue.process('push_notification_code', (job, done) => {
  sendNotification(job.data.phoneNumber, job.data.message);
  done();
});
