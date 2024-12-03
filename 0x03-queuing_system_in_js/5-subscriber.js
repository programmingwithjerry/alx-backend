#!/usr/bin/yarn dev
// Shebang line to allow the script to be executed directly with "yarn dev" in a Node.js environment.

import { createClient } from 'redis';
// Importing the 'createClient' function from the 'redis' module to connect to the Redis server.

const client = createClient();
// Creating a Redis client instance to interact with the Redis server.

const EXIT_MSG = 'KILL_SERVER';
// A constant string used as the termination message.
// If a message with this content is received, the script will stop listening to the channel and close the connection.

client.on('error', (err) => {
  // Listening for the 'error' event on the Redis client.
  // Logs an error message if there is an issue connecting to the Redis server or during operations.
  console.log('Redis client not connected to the server:', err.toString());
});

client.on('connect', () => {
  // Listening for the 'connect' event on the Redis client.
  // Logs a message when the connection to the Redis server is successfully established.
  console.log('Redis client connected to the server');
});

client.subscribe('holberton school channel');
// Subscribing to the Redis channel named 'holberton school channel'.
// This allows the client to receive messages sent to this channel.

client.on('message', (_err, msg) => {
  // Listening for the 'message' event on the Redis client.
  // Parameters:
  // - _err: Placeholder for any errors (not used in this context).
  // - msg: The message received from the subscribed channel.

  console.log(msg); // Logs the message received from the channel to the console.

  if (msg === EXIT_MSG) {
    // Checks if the received message matches the termination message.
    client.unsubscribe(); // Unsubscribes from the 'holberton school channel'.
    client.quit(); // Closes the connection to the Redis server.
  }
});
