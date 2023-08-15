const express = require('express');
const router = express.Router();
const ProductsController = require('../controllers/productsController');

const productsController = new ProductsController('products.json');

// Ruta raíz
router.get('/', async (req, res) => {
  try {
    const products = await productsController.getProducts();
    res.render('home', { products });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

// Ruta para la vista de tiempo real
router.get('/realTimeProducts', async (req, res) => {
  try {
    const products = await productsController.getProducts();
    res.render('realTimeProducts', { products });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos en tiempo real' });
  }
});

module.exports = router;
