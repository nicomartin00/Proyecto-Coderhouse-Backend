const express = require('express');
const cartsRouter = express.Router();
const CartsController = require('../controllers/CartsController');

const cartsController = new CartsController('carts.json');

// Obtener un carrito por su ID
cartsRouter.get('/:cid', async (req, res) => {
  const cartId = parseInt(req.params.cid, 10);
  try {
    const cart = await cartsController.getCart(cartId);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
});

// Crear un nuevo carrito
cartsRouter.post('/', async (req, res) => {
  try {
    const cartId = await cartsController.createCart();
    res.json({ message: 'Carrito creado con éxito', cartId });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el carrito' });
  }
});

// Actualizar un carrito por su ID
cartsRouter.put('/:cid', async (req, res) => {
  const cartId = parseInt(req.params.cid, 10);
  const updatedProducts = req.body.products || [];
  try {
    await cartsController.updateCart(cartId, updatedProducts);
    res.json({ message: 'Carrito actualizado con éxito' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el carrito' });
  }
});

module.exports = cartsRouter;