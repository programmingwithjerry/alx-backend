#!/usr/bin/yarn dev
// Shebang line indicates the script should be executed using "yarn dev".

import express from 'express'; // Importing Express framework for building the server.
import { promisify } from 'util'; // Promisify utility to handle callbacks as Promises.
import { createQueue } from 'kue'; // Kue library for job queue processing.
import { createClient } from 'redis'; // Redis client for caching and state management.

const app = express(); // Initialize Express application.
const client = createClient({ name: 'reserve_seat' }); // Redis client instance with custom namespace.
const queue = createQueue(); // Create a Kue queue instance.
const INITIAL_SEATS_COUNT = 50; // Initial number of available seats.
let reservationEnabled = false; // Flag to enable or disable seat reservations dynamically.
const PORT = 1245; // Define the port where the API will run.

/**
 * Updates the total number of available seats in Redis.
 * @param {number} number - The updated number of seats.
 * @returns {Promise<void>} Resolves when the update is complete.
 */
const reserveSeat = async (number) => {
  return promisify(client.SET).bind(client)('available_seats', number);
};

/**
 * Retrieves the current number of available seats from Redis.
 * @returns {Promise<number>} The number of available seats.
 */
const getCurrentAvailableSeats = async () => {
  const seats = await promisify(client.GET).bind(client)('available_seats');
  return parseInt(seats, 10) || 0; // Return 0 if no value is stored.
};

// Endpoint to check the current availability of seats.
app.get('/available_seats', (_, res) => {
  getCurrentAvailableSeats().then((numberOfAvailableSeats) => {
    res.json({ numberOfAvailableSeats });
  });
});

// Endpoint to reserve a seat.
app.get('/reserve_seat', (_req, res) => {
  if (!reservationEnabled) {
    // If reservations are disabled, notify the client.
    res.json({ status: 'Reservations are blocked' });
    return;
  }

  try {
    const job = queue.create('reserve_seat'); // Create a job to handle seat reservation.

    // Event listener for job failure.
    job.on('failed', (err) => {
      console.log(
        'Seat reservation job',
        job.id,
        'failed:',
        err.message || err.toString()
      );
    });

    // Event listener for job completion.
    job.on('complete', () => {
      console.log('Seat reservation job', job.id, 'completed');
    });

    job.save(); // Save the job to the queue.
    res.json({ status: 'Reservation in process' });
  } catch (error) {
    // Handle errors during job creation.
    res.json({ status: 'Reservation failed' });
  }
});

// Endpoint to process the reservation queue.
app.get('/process', (_req, res) => {
  res.json({ status: 'Queue processing started' });

  queue.process('reserve_seat', (_job, done) => {
    // Fetch the current available seats and handle reservations.
    getCurrentAvailableSeats()
      .then((availableSeats) => {
        // Disable reservations if seats are almost exhausted.
        if (availableSeats <= 1) {
          reservationEnabled = false;
        }

        if (availableSeats > 0) {
          // Deduct one seat and update in Redis.
          return reserveSeat(availableSeats - 1).then(() => done());
        } else {
          done(new Error('Not enough seats available')); // Notify insufficient seats.
        }
      })
      .catch((err) => done(err)); // Handle unexpected errors.
  });
});

/**
 * Resets the available seats to the initial value.
 * @param {number} initialSeatsCount - The number of seats to reset to.
 * @returns {Promise<void>} Resolves when reset is complete.
 */
const resetAvailableSeats = async (initialSeatsCount) => {
  return promisify(client.SET).bind(client)(
    'available_seats',
    parseInt(initialSeatsCount, 10)
  );
};

// Start the Express server and initialize the available seats.
app.listen(PORT, () => {
  resetAvailableSeats(process.env.INITIAL_SEATS_COUNT || INITIAL_SEATS_COUNT)
    .then(() => {
      reservationEnabled = true; // Enable reservations on server start.
      console.log(`API available on localhost port ${PORT}`);
    });
});

export default app; // Export the app for testing or integration.
