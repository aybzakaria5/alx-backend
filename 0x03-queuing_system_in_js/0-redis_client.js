import { createClient } from 'redis';

// Creating a Redis instance for the client
const client = createClient();

// Event handler for error events 
client.on('error', (err) => {
  console.log('Redis client not connected to the server:', err.toString());
});

// Event handler for connect events
client.on('connect', () => {
  console.log('Redis client connected to the server');
});
