#!/usr/bin/yarn dev
// Shebang line for running the script using "yarn dev". It ensures compatibility with Yarn's environment.

import { createClient, print } from 'redis';
// Importing 'createClient' to establish a connection with the Redis server
// Importing 'print', a utility function from Redis, to print the results of Redis commands.

const client = createClient();
// Creating a Redis client instance to interact with the Redis server.

client.on('error', (err) => {
  // Listening for the 'error' event on the Redis client.
  // Logs an error message if there is an issue connecting to the Redis server.
  console.log('Redis client not connected to the server:', err.toString());
});

client.on('connect', () => {
  // Listening for the 'connect' event on the Redis client.
  // Logs a message when the connection to the Redis server is successfully established.
  console.log('Redis client connected to the server');
});

const setNewSchool = (schoolName, value) => {
  // Function to set a new key-value pair in the Redis database.
  // Parameters:
  // - schoolName: The key name (string) to set in the database.
  // - value: The value associated with the key.
  // 'client.SET' sets the key-value pair in Redis, and 'print' logs the result of the operation.
  client.SET(schoolName, value, print);
};

const displaySchoolValue = (schoolName) => {
  // Function to retrieve and display the value associated with a key in the Redis database.
  // Parameters:
  // - schoolName: The key name (string) to retrieve the value for.
  // 'client.GET' retrieves the value, and the callback logs it to the console.
  client.GET(schoolName, (_err, reply) => {
    console.log(reply);
  });
};

// Calling 'displaySchoolValue' to get the value of the key 'Holberton' (initially not set in Redis).
displaySchoolValue('Holberton');

// Setting a new key-value pair ('HolbertonSanFrancisco', '100') in Redis.
setNewSchool('HolbertonSanFrancisco', '100');

// Retrieving and displaying the value of 'HolbertonSanFrancisco' after it has been set.
displaySchoolValue('HolbertonSanFrancisco');
