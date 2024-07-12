import { createClient, print } from 'redis';

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

// Function to set a new value for a given school name
const setNewSchool = (schoolName, value) => {
  client.set(schoolName, value, print);
};

// Function to display the value of a given school name
const displaySchoolValue = (schoolName) => {
  client.get(schoolName, (_err, reply) => {
    console.log(reply);
  });
};

// Calling the functions with the specified arguments
displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
