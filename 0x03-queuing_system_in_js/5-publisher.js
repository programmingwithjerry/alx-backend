#!/usr/bin/yarn dev
// Shebang line to allow the script to be executed directly with "yarn dev" in a Node.js environment.

import { createClient } from 'redis';
// Importing the 'createClient' function from the 'redis' module to connect to a Redis server.

const client = createClient();
// Creating a Redis client instance to interact with the Redis server.

client.on('error', (err) => {
  // Listening for the 'error' event on the Redis client.
  // Logs an error message if there is an issue connecting to the Redis server or during operations.
  console.log('Redis client not connected to the server:', err.toString());
});

const publishMessage = (message, time) => {
  // Function to publish a message to a Redis channel after a specified delay.
  // Parameters:
  // - message: The message string to be published.
  // - time: The delay (in milliseconds) before publishing the message.
  
  setTimeout(() => {
    // Using setTimeout to introduce a delay before publishing the message.
    console.log(`About to send ${message}`); // Log the message to be sent.
    client.publish('holberton school channel', message);
    // Publishing the message to the Redis channel named 'holberton school channel'.
  }, time);
};

client.on('connect', () => {
  // Listening for the 'connect' event on the Redis client.
  // Logs a message when the connection to the Redis server is successfully established.
  console.log('Redis client connected to the server');
});

// Publishing messages to the 'holberton school channel' at different times.
publishMessage('Holberton Student #1 starts course', 100); // Sends after 100 ms.
publishMessage('Holberton Student #2 starts course', 200); // Sends after 200 ms.
publishMessage('KILL_SERVER', 300); // Sends after 300 ms. Intended to signal server termination.
publishMessage('Holberton Student #3 starts course', 400); // Sends after 400 ms.
