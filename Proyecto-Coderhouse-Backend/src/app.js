const express = require('express');
const fs = require('fs').promises;
const app = express();
const bodyParser = require('body-parser');

// Middleware para procesar el cuerpo de las solicitudes en formato JSON
app.use(express.json());

// Rutas y controladores para el grupo de productos
const productsRouter = express.Router();

// Obtener todos los productos o un número específico de productos con el límite
productsRouter.get('/', async (req, res) => {
  const { limit } = req.query;
  try {
    const data = await fs.readFile('products.json', 'utf8');
    const products = JSON.parse(data);
    let limitedProducts = products;
    if (limit) {
      limitedProducts = products.slice(0, parseInt(limit, 10));
    }
    res.json(limitedProducts);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

// Obtener un producto por su ID
productsRouter.get('/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid, 10);
  try {
    const data = await fs.readFile('products.json', 'utf8');
    const products = JSON.parse(data);
    const product = products.find((p) => p.id === productId);
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
  // Verificar que todos los campos obligatorios estén presentes
  if (!newProduct.id || !newProduct.title || !newProduct.description || !newProduct.code || !newProduct.price || !newProduct.status || !newProduct.stock || !newProduct.category) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios, a excepción de thumbnails' });
  }
  try {
    const data = await fs.readFile('products.json', 'utf8');
    const products = JSON.parse(data);
    // Agregar el nuevo producto a la lista
    products.push(newProduct);
    await fs.writeFile('products.json', JSON.stringify(products));
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
    const data = await fs.readFile('products.json', 'utf8');
    const products = JSON.parse(data);
    // Encontrar el índice del producto en la lista
    const productIndex = products.findIndex((p) => p.id === productId);
    if (productIndex !== -1) {
      // Actualizar los campos del producto
      products[productIndex] = { ...products[productIndex], ...updatedFields };
      await fs.writeFile('products.json', JSON.stringify(products));
      res.json({ message: 'Producto actualizado con éxito' });
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

// Eliminar un producto por su ID
productsRouter.delete('/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid, 10);
  try {
    const data = await fs.readFile('products.json', 'utf8');
    const products = JSON.parse(data);
    // Encontrar el índice del producto en la lista
    const productIndex = products.findIndex((p) => p.id === productId);
    if (productIndex !== -1) {
      // Eliminar el producto de la lista
      products.splice(productIndex, 1);
      await fs.writeFile('products.json', JSON.stringify(products));
      res.json({ message: 'Producto eliminado con éxito' });
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

// Registrar el router de productos bajo la ruta /api/products
app.use('/api/products', productsRouter);

// Rutas y controladores para el grupo de carritos
const cartsRouter = express.Router();

// Crear un nuevo carrito
cartsRouter.post('/', async (req, res) => {
  try {
    const newCart = {
      id: Date.now(), // Usar una marca de tiempo como ID temporal
      products: [],
    };
    await fs.writeFile('carrito.json', JSON.stringify(newCart));
    res.json({ message: 'Carrito creado con éxito', cartId: newCart.id });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el carrito' });
  }
});

// Obtener los productos de un carrito por su ID
cartsRouter.get('/:cid', async (req, res) => {
  const cartId = parseInt(req.params.cid, 10);
  try {
    const data = await fs.readFile('carrito.json', 'utf8');
    const cart = JSON.parse(data);
    if (cart.id === cartId) {
      res.json(cart.products);
    } else {
      res.status(404).json({ error: 'Carrito no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
});

// Agregar un producto al carrito
cartsRouter.post('/:cid/product/:pid', async (req, res) => {
  const cartId = parseInt(req.params.cid, 10);
  const productId = parseInt(req.params.pid, 10);
  const quantity = req.body.quantity || 1;
  try {
    const cartData = await fs.readFile('carrito.json', 'utf8');
    const cart = JSON.parse(cartData);
    if (cart.id === cartId) {
      // Verificar si el producto ya existe en el carrito
      const existingProduct = cart.products.find((p) => p.product === productId);
      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }
      await fs.writeFile('carrito.json', JSON.stringify(cart));
      res.json({ message: 'Producto agregado al carrito con éxito' });
    } else {
      res.status(404).json({ error: 'Carrito no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el producto al carrito' });
  }
});

// Registrar el router de carritos bajo la ruta /api/carts
app.use('/api/carts', cartsRouter);

// Iniciar el servidor en el puerto 8080
const port = 8080;
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});