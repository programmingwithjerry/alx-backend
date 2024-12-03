#!/usr/bin/yarn dev
// Shebang line to ensure the script runs with "yarn dev" in a Node.js environment.

import { promisify } from 'util';
// Importing the 'promisify' function from the 'util' module to convert callback-based functions to promise-based ones.

import { createClient, print } from 'redis';
// Importing 'createClient' to connect to the Redis server.
// Importing 'print' to log the result of Redis commands.

const client = createClient();
// Creating a Redis client instance to interact with the Redis server.

client.on('error', (err) => {
  // Listening for the 'error' event on the Redis client.
  // Logs an error message if there is a connection issue or another Redis-related error.
  console.log('Redis client not connected to the server:', err.toString());
});

const setNewSchool = (schoolName, value) => {
  // Function to set a new key-value pair in the Redis database.
  // Parameters:
  // - schoolName: The key name (string) to set in Redis.
  // - value: The value (string) to associate with the key.
  // 'client.SET' sets the key-value pair, and 'print' logs the result of the operation.
  client.SET(schoolName, value, print);
};

const displaySchoolValue = async (schoolName) => {
  // Function to retrieve and display the value of a key in Redis using async/await.
  // Parameters:
  // - schoolName: The key name (string) to retrieve the value for.
  // 'promisify' is used to convert the callback-based GET command into a promise-based function.
  console.log(await promisify(client.GET).bind(client)(schoolName));
};

async function main() {
  // Main function to demonstrate the workflow of setting and retrieving data in Redis.
  // Uses async/await to ensure the operations occur in sequence.
  
  await displaySchoolValue('Holberton'); // Display the value of 'Holberton' (initially undefined).
  setNewSchool('HolbertonSanFrancisco', '100'); // Set a new key-value pair ('HolbertonSanFrancisco', '100').
  await displaySchoolValue('HolbertonSanFrancisco'); // Display the value of 'HolbertonSanFrancisco'.
}

client.on('connect', async () => {
  // Listening for the 'connect' event on the Redis client.
  // Logs a message when successfully connected to the Redis server.
  console.log('Redis client connected to the server');
  
  await main(); // Call the main function after the connection is established.
});
