import { createClient, print } from 'redis';

// Creating a Redis client instance
const client = createClient();

// Event handler for error events - logs an error message when connection fails
client.on('error', (err) => {
  console.log('Redis client not connected to the server:', err.toString());
});

// Function to update the hash with the provided field name and value
const updateHash = (hashName, fieldName, fieldValue) => {
  client.hset(hashName, fieldName, fieldValue, print);
};

// Function to print the hash object
const printHash = (hashName) => {
  client.hgetall(hashName, (_err, reply) => {
    console.log(reply);
  });
};

// Main function to set and display the hash values
function main() {
  const hashObj = {
    Portland: 50,
    Seattle: 80,
    'New York': 20,
    Bogota: 20,
    Cali: 40,
    Paris: 2,
  };
  
  // Looping through the hash object to update the hash values
  for (const [field, value] of Object.entries(hashObj)) {
    updateHash('HolbertonSchools', field, value);
  }
  
  // Displaying the hash object
  printHash('HolbertonSchools');
}

// Event handler for connect events - logs a success message and runs the main function when connection is established
client.on('connect', () => {
  console.log('Redis client connected to the server');
  main();
});
