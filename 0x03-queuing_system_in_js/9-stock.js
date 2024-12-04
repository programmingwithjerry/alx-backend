#!/usr/bin/yarn dev
// Shebang to indicate the script should be run with the "yarn dev" command.

import express from 'express';
// Import the Express framework to create the server.

import { promisify } from 'util';
// Import the `promisify` function to convert callback-based Redis methods into Promises.

import { createClient } from 'redis';
// Import the Redis client for interacting with the Redis database.

const listProducts = [
  // Array of product objects, each representing an item available in the store.
  {
    itemId: 1,
    itemName: 'Suitcase 250',
    price: 50,
    initialAvailableQuantity: 4,
  },
  {
    itemId: 2,
    itemName: 'Suitcase 450',
    price: 100,
    initialAvailableQuantity: 10,
  },
  {
    itemId: 3,
    itemName: 'Suitcase 650',
    price: 350,
    initialAvailableQuantity: 2,
  },
  {
    itemId: 4,
    itemName: 'Suitcase 1050',
    price: 550,
    initialAvailableQuantity: 5,
  },
];

/**
 * Finds a product by its ID and returns a copy of its data.
 * @param {number} id - The ID of the product to retrieve.
 * @returns {object|undefined} - The product object or undefined if not found.
 */
const getItemById = (id) => {
  const item = listProducts.find((obj) => obj.itemId === id);
  return item ? { ...item } : undefined;
};

const app = express(); // Initialize the Express app.
const client = createClient(); // Create a Redis client instance.
const PORT = 1245; // Port number for the server.

/**
 * Updates the reserved stock for a specific product in Redis.
 * @param {number} itemId - The ID of the product.
 * @param {number} stock - The new reserved stock value.
 * @returns {Promise<void>}
 */
const reserveStockById = async (itemId, stock) => {
  return promisify(client.SET).bind(client)(`item.${itemId}`, stock);
};

/**
 * Fetches the current reserved stock for a product from Redis.
 * @param {number} itemId - The ID of the product.
 * @returns {Promise<number>} - The reserved stock value or 0 if not set.
 */
const getCurrentReservedStockById = async (itemId) => {
  const stock = await promisify(client.GET).bind(client)(`item.${itemId}`);
  return stock ? parseInt(stock, 10) : 0;
};

// Route to list all available products.
app.get('/list_products', (_, res) => {
  res.json(listProducts);
});

// Route to get detailed information about a specific product by ID.
app.get('/list_products/:itemId(\\d+)', (req, res) => {
  const itemId = parseInt(req.params.itemId, 10);
  const productItem = getItemById(itemId);

  if (!productItem) {
    res.json({ status: 'Product not found' });
    return;
  }

  getCurrentReservedStockById(itemId)
    .then((reservedStock) => {
      productItem.currentQuantity =
        productItem.initialAvailableQuantity - reservedStock;
      res.json(productItem);
    });
});

// Route to reserve a product by ID.
app.get('/reserve_product/:itemId', (req, res) => {
  const itemId = parseInt(req.params.itemId, 10);
  const productItem = getItemById(itemId);

  if (!productItem) {
    res.json({ status: 'Product not found' });
    return;
  }

  getCurrentReservedStockById(itemId)
    .then((reservedStock) => {
      if (reservedStock >= productItem.initialAvailableQuantity) {
        res.json({ status: 'Not enough stock available', itemId });
        return;
      }

      reserveStockById(itemId, reservedStock + 1)
        .then(() => {
          res.json({ status: 'Reservation confirmed', itemId });
        });
    });
});

/**
 * Resets the reserved stock for all products in Redis to 0.
 * @returns {Promise<void[]>} - A promise resolving when all stocks are reset.
 */
const resetProductsStock = () => {
  return Promise.all(
    listProducts.map((item) =>
      promisify(client.SET).bind(client)(`item.${item.itemId}`, 0)
    )
  );
};

// Start the server and reset all reserved stocks on launch.
app.listen(PORT, () => {
  resetProductsStock().then(() => {
    console.log(`API available on localhost port ${PORT}`);
  });
});

export default app;
// Exports the app instance for potential testing or further extension.
