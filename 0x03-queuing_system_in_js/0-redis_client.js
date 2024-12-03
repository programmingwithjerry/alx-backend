#!/usr/bin/yarn dev
// This is the shebang line for Node.js using Yarn. It ensures the script runs with the "yarn dev" command.

import { createClient } from 'redis';
// Importing the 'createClient' function from the 'redis' module to interact with a Redis server.

const client = createClient();
// Creating a new Redis client instance to connect to the Redis server.

client.on('error', (err) => {
  // Listening for an 'error' event on the Redis client.
  // If there’s an error connecting or during operation, this callback logs the error message.
  console.log('Redis client not connected to the server:', err.toString());
});

client.on('connect', () => {
  // Listening for a 'connect' event on the Redis client.
  // When a connection to the Redis server is established, this callback logs a success message.
  console.log('Redis client connected to the server');
});
