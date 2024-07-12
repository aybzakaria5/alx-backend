import { createClient } from 'redis';

// Creating a Redis client instance
const client = createClient();

// Event handler for error events - logs an error message when connection fails
client.on('error', (err) => {
  console.log('Redis client not connected to the server:', err.toString());
});

// Event handler for connect events - logs a success message when connection is established
client.on('connect', () => {
  console.log('Redis client connected to the server');
});

// Function to publish a message to the specified channel after a delay
const publishMessage = (message, time) => {
  setTimeout(() => {
    console.log(`About to send ${message}`);
    client.publish('holberton school channel', message);
  }, time);
};

// Publishing messages with different delays
publishMessage('Holberton Student #1 starts course', 100);
publishMessage('Holberton Student #2 starts course', 200);
publishMessage('KILL_SERVER', 300);
publishMessage('Holberton Student #3 starts course', 400);
