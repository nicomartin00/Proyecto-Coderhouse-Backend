const express = require('express');
const router = express.Router();
const ProductsController = require('../controllers/ProductsController');

const productsController = new ProductsController('products.json');

// Ruta raíz
router.get('/', async (req, res) => {
  try {
    const products = await productsController.getProducts();
    console.log(products);
    res.render('home', { products });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

// Ruta para la vista de tiempo real
router.get('/realTimeProducts', (req, res) => {
  res.render('realTimeProducts', { products: [] });
});

module.exports = router;