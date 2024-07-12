import express from 'express';
import { createClient } from 'redis';
import { promisify } from 'util';

// Data: list of products
const listProducts = [
  { itemId: 1, itemName: 'Suitcase 250', price: 50, initialAvailableQuantity: 4 },
  { itemId: 2, itemName: 'Suitcase 450', price: 100, initialAvailableQuantity: 10 },
  { itemId: 3, itemName: 'Suitcase 650', price: 350, initialAvailableQuantity: 2 },
  { itemId: 4, itemName: 'Suitcase 1050', price: 550, initialAvailableQuantity: 5 },
];

// Function to get a product by ID
const getItemById = (id) => {
  return listProducts.find(product => product.itemId === id);
};

// Express server setup
const app = express();
const client = createClient();
const PORT = 1245;

// Promisify Redis methods
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

// Function to reserve stock by ID
const reserveStockById = async (itemId, stock) => {
  await setAsync(`item.${itemId}`, stock);
};

// Function to get current reserved stock by ID
const getCurrentReservedStockById = async (itemId) => {
  const stock = await getAsync(`item.${itemId}`);
  return stock ? parseInt(stock, 10) : 0;
};

// Route to list all products
app.get('/list_products', (req, res) => {
  res.json(listProducts);
});

// Route to get a specific product by ID
app.get('/list_products/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId, 10);
  const product = getItemById(itemId);

  if (!product) {
    res.json({ status: 'Product not found' });
    return;
  }

  const reservedStock = await getCurrentReservedStockById(itemId);
  const currentQuantity = product.initialAvailableQuantity - reservedStock;

  res.json({
    itemId: product.itemId,
    itemName: product.itemName,
    price: product.price,
    initialAvailableQuantity: product.initialAvailableQuantity,
    currentQuantity,
  });
});

// Route to reserve a product
app.get('/reserve_product/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId, 10);
  const product = getItemById(itemId);

  if (!product) {
    res.json({ status: 'Product not found' });
    return;
  }

  const reservedStock = await getCurrentReservedStockById(itemId);

  if (reservedStock >= product.initialAvailableQuantity) {
    res.json({ status: 'Not enough stock available', itemId });
    return;
  }

  await reserveStockById(itemId, reservedStock + 1);
  res.json({ status: 'Reservation confirmed', itemId });
});

// Reset the stock of all products in Redis
const resetProductsStock = async () => {
  await Promise.all(
    listProducts.map(item => setAsync(`item.${item.itemId}`, 0))
  );
};

// Start the server
app.listen(PORT, async () => {
  await resetProductsStock();
  console.log(`API available on localhost port ${PORT}`);
});

export default app;
