const express = require('express');
const ProductsController = require('../controllers/ProductsController');
const productsRouter = express.Router();
const productsController = new ProductsController('products.json');

// Obtener un producto por su ID
productsRouter.get('/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid, 10);
  try {
    const product = await productsController.getProductById(productId);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

// Agregar un nuevo producto
productsRouter.post('/', async (req, res) => {
  const newProduct = req.body;
  try {
    await productsController.addProduct(newProduct);
    res.json({ message: 'Producto agregado con éxito' });
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el producto' });
  }
});

// Actualizar un producto por su ID
productsRouter.put('/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid, 10);
  const updatedFields = req.body;
  try {
    await productsController.updateProduct(productId, updatedFields);
    res.json({ message: 'Producto actualizado con éxito' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

// Eliminar un producto por su ID
productsRouter.delete('/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid, 10);
  try {
    await productsController.deleteProduct(productId);
    res.json({ message: 'Producto eliminado con éxito' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

module.exports = productsRouter;