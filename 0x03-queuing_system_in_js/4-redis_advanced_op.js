#!/usr/bin/yarn dev
// Shebang line to allow the script to be executed with "yarn dev" in a Node.js environment.

import { createClient, print } from 'redis';
// Importing 'createClient' to establish a connection to the Redis server.
// Importing 'print' to log the results of Redis commands to the console.

const client = createClient();
// Creating a Redis client instance to interact with the Redis server.

client.on('error', (err) => {
  // Listening for the 'error' event on the Redis client.
  // Logs an error message if there is an issue connecting to the Redis server or during operations.
  console.log('Redis client not connected to the server:', err.toString());
});

const updateHash = (hashName, fieldName, fieldValue) => {
  // Function to update a hash in the Redis database by setting a field-value pair.
  // Parameters:
  // - hashName: The name of the hash to update.
  // - fieldName: The field (key) in the hash to update or add.
  // - fieldValue: The value to set for the field.
  // 'client.HSET' adds the field-value pair to the hash, and 'print' logs the result of the operation.
  client.HSET(hashName, fieldName, fieldValue, print);
};

const printHash = (hashName) => {
  // Function to retrieve and print all fields and values from a hash in the Redis database.
  // Parameters:
  // - hashName: The name of the hash to retrieve data from.
  // 'client.HGETALL' fetches all fields and values from the hash,
  // and the callback logs the result to the console.
  client.HGETALL(hashName, (_err, reply) => console.log(reply));
};

function main() {
  // Main function to demonstrate the workflow of updating and retrieving a hash in Redis.
  const hashObj = {
    // An object representing fields and their values to store in the hash.
    Portland: 50,
    Seattle: 80,
    'New York': 20,
    Bogota: 20,
    Cali: 40,
    Paris: 2,
  };

  // Iterating through the object to add each field-value pair to the hash 'HolbertonSchools'.
  for (const [field, value] of Object.entries(hashObj)) {
    updateHash('HolbertonSchools', field, value);
  }

  // Printing all fields and values of the 'HolbertonSchools' hash.
  printHash('HolbertonSchools');
}

client.on('connect', () => {
  // Listening for the 'connect' event on the Redis client.
  // Logs a message when the connection to the Redis server is successfully established.
  console.log('Redis client connected to the server');

  // Calling the main function to execute the Redis operations after the connection is established.
  main();
});
