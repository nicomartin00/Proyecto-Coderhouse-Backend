const fs = require('fs');

class ProductManager {
  constructor() {
    this.products = [];
    this.currentId = 1;
    this.path = "products.json";
    this.loadProductsAsync().then(() => {
      console.log("Productos cargados exitosamente");
    }).catch((error) => {
      console.error("Error al cargar los productos:", error);
    });
  }

  async loadProductsAsync() {
    try {
      const data = await fs.promises.readFile(this.path, 'utf8');
      this.products = JSON.parse(data);
      if (!Array.isArray(this.products)) {
        this.products = [];
      }
      if (this.products.length > 0) {
        this.currentId = this.products[this.products.length - 1].id + 1;
      }
    } catch (error) {
      this.products = [];
      throw error;
    }
  }

  async saveProducts() {
    const data = JSON.stringify(this.products);
    await fs.promises.writeFile(this.path, data);
  }

	addProduct(product) {
		if(!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
			console.log("Todos los campos son obligatorios");
			return;
		}

		if(this.products.some((p)=> p.code === product.code)) {
			console.log("El campo 'code' ya esta en uso");
			return;
		}

		const newProduct = {
			...product,
			id: this.currentId++
		};
		
		this.products.push(newProduct);
		this.saveProducts();
		console.log("Producto agregado con exito");
	}
	
	updateProduct(id, updatedFields) {
		const productIndex = this.products.findIndex((p) => p.id === id);
	
		if (productIndex !== -1) {
		  const updatedProduct = {
			...this.products[productIndex],
			...updatedFields
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
}

module.exports = ProductManager;