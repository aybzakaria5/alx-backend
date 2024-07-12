import express from 'express';
import { promisify } from 'util';
import { createClient } from 'redis';
import kue from 'kue';

// Initialize the Express application
const app = express();
const client = createClient();
const queue = kue.createQueue();
const PORT = 1245;

// Initial number of available seats
const INITIAL_SEATS_COUNT = 50;
let reservationEnabled = true;

/**
 * Sets the number of available seats in Redis.
 * @param {number} number - The new number of seats.
 */
const reserveSeat = async (number) => {
  const setAsync = promisify(client.set).bind(client);
  await setAsync('available_seats', number);
};

/**
 * Retrieves the current number of available seats from Redis.
 * @returns {Promise<number>} The current number of available seats.
 */
const getCurrentAvailableSeats = async () => {
  const getAsync = promisify(client.get).bind(client);
  const seats = await getAsync('available_seats');
  return parseInt(seats, 10) || 0;
};

// Route to get the number of available seats
app.get('/available_seats', async (req, res) => {
  const numberOfAvailableSeats = await getCurrentAvailableSeats();
  res.json({ numberOfAvailableSeats });
});

// Route to reserve a seat
app.get('/reserve_seat', (req, res) => {
  if (!reservationEnabled) {
    res.json({ status: 'Reservations are blocked' });
    return;
  }

  const job = queue.create('reserve_seat').save((err) => {
    if (err) {
      res.json({ status: 'Reservation failed' });
    } else {
      res.json({ status: 'Reservation in process' });
    }
  });

  job.on('complete', () => {
    console.log(`Seat reservation job ${job.id} completed`);
  });

  job.on('failed', (err) => {
    console.log(`Seat reservation job ${job.id} failed: ${err.message}`);
  });
});

// Route to process the reservation queue
app.get('/process', async (req, res) => {
  res.json({ status: 'Queue processing' });

  queue.process('reserve_seat', async (job, done) => {
    const availableSeats = await getCurrentAvailableSeats();

    if (availableSeats > 0) {
      await reserveSeat(availableSeats - 1);
      if (availableSeats - 1 === 0) {
        reservationEnabled = false;
      }
      done();
    } else {
      done(new Error('Not enough seats available'));
    }
  });
});

// Function to reset the available seats to the initial count
const resetAvailableSeats = async (initialSeatsCount) => {
  await reserveSeat(initialSeatsCount);
};

// Start the server and reset the seats on launch
app.listen(PORT, async () => {
  await resetAvailableSeats(INITIAL_SEATS_COUNT);
  console.log(`API available on localhost port ${PORT}`);
});

export default app;
