const fs = require('fs').promises;
const path = require('path');

class CartsController {
  constructor(cartsPath) {
    this.cartsPath = path.join(__dirname, '..', 'data', cartsPath);
  }

  async getCart(cartId) {
    try {
      const data = await fs.readFile(this.cartsPath, 'utf8');
      const carts = JSON.parse(data);
      const cart = carts.find((c) => c.id === cartId);
      if (cart) {
        return cart;
      } else {
        throw new Error('Carrito no encontrado');
      }
    } catch (error) {
      throw new Error('Error al obtener el carrito');
    }
  }

  async createCart() {
    try {
      const newCart = {
        id: Date.now(),
        products: [],
      };
      const data = await fs.readFile(this.cartsPath, 'utf8');
      const carts = JSON.parse(data);
      carts.push(newCart);
      await fs.writeFile(this.cartsPath, JSON.stringify(carts));
      return newCart.id;
    } catch (error) {
      throw new Error('Error al crear el carrito');
    }
  }

  async updateCart(cartId, updatedProducts) {
    try {
      const data = await fs.readFile(this.cartsPath, 'utf8');
      const carts = JSON.parse(data);
      const cartIndex = carts.findIndex((c) => c.id === cartId);
      if (cartIndex !== -1) {
        carts[cartIndex].products = updatedProducts;
        await fs.writeFile(this.cartsPath, JSON.stringify(carts));
      } else {
        throw new Error('Carrito no encontrado');
      }
    } catch (error) {
      throw new Error('Error al actualizar el carrito');
    }
  }
}

module.exports = CartsController;