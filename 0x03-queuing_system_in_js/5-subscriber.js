import { createClient } from 'redis';

// Creating a Redis client instance
const client = createClient();
const EXIT_MSG = 'KILL_SERVER';

// Event handler for error events - logs an error message when connection fails
client.on('error', (err) => {
  console.log('Redis client not connected to the server:', err.toString());
});

// Event handler for connect events - logs a success message when connection is established
client.on('connect', () => {
  console.log('Redis client connected to the server');
});

// Subscribing to the specified channel
client.subscribe('holberton school channel');

// Event handler for message events - logs the received message
client.on('message', (_err, msg) => {
  console.log(msg);
  // Unsubscribe and quit the client if the received message is the exit message
  if (msg === EXIT_MSG) {
    client.unsubscribe();
    client.quit();
  }
});
