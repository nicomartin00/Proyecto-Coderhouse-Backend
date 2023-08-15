const fs = require('fs').promises;

class ProductManager {
  constructor() {
    this.products = [];
    this.currentId = 1;
    this.productsPath = "../data/products.json";
    this.cartsPath = "../data/carrito.json";
    this.loadProductsAsync();
  }

  async loadProductsAsync() {
    try {
      const productsData = await fs.readFile(this.productsPath, 'utf8');
      this.products = JSON.parse(productsData);
      if (!Array.isArray(this.products)) {
        this.products = [];
      }
      if (this.products.length > 0) {
        this.currentId = this.products[this.products.length - 1].id + 1;
      }
    } catch (error) {
      this.products = [];
      console.error('Error al cargar los productos:', error);
    }
  }

  async saveProducts() {
    try {
      const data = JSON.stringify(this.products);
      await fs.promises.writeFile(this.path, data);
      console.log("Productos guardados con éxito en el archivo.");
    } catch (error) {
      console.error("Error al guardar los productos:", error);
    }
  }

  addProduct(product) {
    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.code ||
      !product.stock
    ) {
      console.log("Todos los campos son obligatorios");
      return;
    }

    if (this.products.some((p) => p.code === product.code)) {
      console.log("El campo 'code' ya está en uso");
      return;
    }

    const newProduct = {
      ...product,
      id: this.currentId++,
    };

    this.products.push(newProduct);
    this.saveProducts();
    console.log("Producto agregado con éxito");
  }

  updateProduct(id, updatedFields) {
    const productIndex = this.products.findIndex((p) => p.id === id);

    if (productIndex !== -1) {
      const updatedProduct = {
        ...this.products[productIndex],
        ...updatedFields,
      };

      this.products[productIndex] = updatedProduct;
      this.saveProducts();
      console.log("Producto actualizado con éxito");
    } else {
      console.log("Producto no encontrado");
    }
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find((p) => p.id === id);
    return product;
  }

  deleteProduct(id) {
    const productIndex = this.products.findIndex((p) => p.id === id);

    if (productIndex > -1) {
      this.products.splice(productIndex, 1);
      this.saveProducts();
      console.log("Producto eliminado con éxito");
    } else {
      console.log("Producto no encontrado");
    }
  }

  // Métodos para el manejo de carritos
  async createCart() {
    const newCart = {
      id: Date.now(),
      products: [],
    };
    try {
      await fs.writeFile(this.cartsPath, JSON.stringify(newCart));
      console.log("Carrito creado con éxito");
      return newCart.id;
    } catch (error) {
      console.error('Error al crear el carrito:', error);
      return null;
    }
  }

  async getCart(cartId) {
    try {
      const cartData = await fs.readFile(this.cartsPath, 'utf8');
      const cart = JSON.parse(cartData);
      if (cart.id === cartId) {
        return cart;
      } else {
        console.log("Carrito no encontrado");
        return null;
      }
    } catch (error) {
      console.error('Error al obtener el carrito:', error);
      return null;
    }
  }

  async addToCart(cartId, productId, quantity = 1) {
    try {
      const cartData = await fs.readFile(this.cartsPath, 'utf8');
      const cart = JSON.parse(cartData);
      if (cart.id === cartId) {
        // Verificar si el producto ya existe en el carrito
        const existingProduct = cart.products.find((p) => p.product === productId);
        if (existingProduct) {
          existingProduct.quantity += quantity;
        } else {
          cart.products.push({ product: productId, quantity });
        }
        await fs.writeFile(this.cartsPath, JSON.stringify(cart));
        console.log("Producto agregado al carrito con éxito");
        return true;
      } else {
        console.log("Carrito no encontrado");
        return false;
      }
    } catch (error) {
      console.error('Error al agregar el producto al carrito:', error);
      return false;
    }
  }
}

module.exports = ProductManager;