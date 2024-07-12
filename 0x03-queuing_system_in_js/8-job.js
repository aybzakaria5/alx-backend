import kue from 'kue';

/**
 * Creates push notification jobs from the array of job info.
 * 
 * @param {Array} jobs - The array of job objects.
 * @param {Object} queue - The Kue queue instance.
 */
const createPushNotificationsJobs = (jobs, queue) => {
  // Validate if the jobs parameter is an array
  if (!Array.isArray(jobs)) {
    throw new Error('Jobs is not an array');
  }

  // Loop through the array of jobs and create a job for each one
  jobs.forEach((jobInfo) => {
    const job = queue.create('push_notification_code_3', jobInfo);

    job
      .on('enqueue', () => {
        console.log('Notification job created:', job.id);
      })
      .on('complete', () => {
        console.log('Notification job', job.id, 'completed');
      })
      .on('failed', (err) => {
        console.log('Notification job', job.id, 'failed:', err.message || err.toString());
      })
      .on('progress', (progress, _data) => {
        console.log('Notification job', job.id, `${progress}% complete`);
      });

    // Save the job to the queue
    job.save();
  });
};

export default createPushNotificationsJobs;
