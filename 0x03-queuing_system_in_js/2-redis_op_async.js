import { promisify } from 'util';
import { createClient, print } from 'redis';

// Creating a Redis client instance
const client = createClient();

// Event handler for error events - logs an error message when connection fails
client.on('error', (err) => {
  console.log('Redis client not connected to the server:', err.toString());
});

// Function to set a new value for a given school name
const setNewSchool = (schoolName, value) => {
  client.set(schoolName, value, print);
};

// Function to display the value of a given school name using async/await
const displaySchoolValue = async (schoolName) => {
  const getAsync = promisify(client.get).bind(client);
  try {
    const value = await getAsync(schoolName);
    console.log(value);
  } catch (err) {
    console.error('Error retrieving value:', err);
  }
};

// Main function to call the display and set functions
async function main() {
  await displaySchoolValue('Holberton');
  setNewSchool('HolbertonSanFrancisco', '100');
  await displaySchoolValue('HolbertonSanFrancisco');
}

// Event handler for connect events - logs a success message and runs the main function when connection is established
client.on('connect', async () => {
  console.log('Redis client connected to the server');
  await main();
});
