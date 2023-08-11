const fs = require('fs').promises;
const path = require('path');

class ProductsController {
  constructor(productsPath) {
    this.productsPath = path.join(__dirname, '..', '/data/', productsPath);
  }

  async getProducts() {
    try {
      const data = await fs.readFile(this.productsPath, 'utf8');
      console.log(data);
      return JSON.parse(data);
    } catch (error) {
      throw new Error('Error al obtener los productos');
    }
  }

  async getProductById(productId) {
    try {
      const data = await fs.readFile(this.productsPath, 'utf8');
      const products = JSON.parse(data);
      const product = products.find((p) => p.id === productId);
      if (product) {
        return product;
      } else {
        throw new Error('Producto no encontrado');
      }
    } catch (error) {
      throw new Error('Error al obtener el producto');
    }
  }

  async addProduct(newProduct) {
    try {
      const data = await fs.readFile(this.productsPath, 'utf8');
      const products = JSON.parse(data);
      products.push(newProduct);
      await fs.writeFile(this.productsPath, JSON.stringify(products));
    } catch (error) {
      throw new Error('Error al agregar el producto');
    }
  }

  async updateProduct(productId, updatedFields) {
    try {
      const data = await fs.readFile(this.productsPath, 'utf8');
      const products = JSON.parse(data);
      const productIndex = products.findIndex((p) => p.id === productId);
      if (productIndex !== -1) {
        products[productIndex] = { ...products[productIndex], ...updatedFields };
        await fs.writeFile(this.productsPath, JSON.stringify(products));
      } else {
        throw new Error('Producto no encontrado');
      }
    } catch (error) {
      throw new Error('Error al actualizar el producto');
    }
  }

  async deleteProduct(productId) {
    try {
      const data = await fs.readFile(this.productsPath, 'utf8');
      let products = JSON.parse(data);
      const productIndex = products.findIndex((p) => p.id === productId);
      if (productIndex !== -1) {
        products.splice(productIndex, 1);
        await fs.writeFile(this.productsPath, JSON.stringify(products));
      } else {
        throw new Error('Producto no encontrado');
      }
    } catch (error) {
      throw new Error('Error al eliminar el producto');
    }
  }
}

module.exports = ProductsController;