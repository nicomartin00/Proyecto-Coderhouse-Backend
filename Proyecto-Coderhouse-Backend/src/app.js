const express = require('express');
const app = express();
const ProductManager = require('./ProductManager.js');

const productManager = new ProductManager('products.json');

// Endpoint para obtener todos los productos o un número específico de productos
app.get('/products', async (req, res) => {
  const { limit } = req.query;
  try {
    const products = await productManager.getProducts();
    if (limit) {
      const limitedProducts = products.slice(0, parseInt(limit, 10));
      res.json(limitedProducts);
    } else {
      res.json(products);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

// Endpoint para obtener un producto por su ID
app.get('/products/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid, 10);
  try {
    const product = await productManager.getProductById(productId);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

// Iniciar el servidor en el puerto 8080
const port = 8080;
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});