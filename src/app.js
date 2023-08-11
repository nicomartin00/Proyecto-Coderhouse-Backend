const express = require('express');
const handlebars = require('express-handlebars');
const http = require('http');
const io = require('socket.io')(http);
const ProductsController = require('./controllers/ProductsController');
const ProductRoutes = require('./routes/productRoutes.js');
const CartRoutes = require('./routes/cartRoutes.js');

const app = express();
const productsController = new ProductsController('products.json');

// Configurar el motor de plantillas Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');

// Middleware para procesar el cuerpo de las solicitudes en formato JSON
app.use(express.json());

// Registrar las rutas de productos bajo /api/products
app.use('/api/products', ProductRoutes);

// Registrar las rutas de carritos bajo /api/carts
app.use('/api/carts', CartRoutes);

// Configurar la conexión de sockets
io.on('connection', (socket) => {
  console.log('Usuario conectado');

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

// Ruta raíz
app.get('/', async (req, res) => {
  try {
    const products = await productsController.getProducts();
    res.render('home', { products }); 
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

// Ruta para la vista de tiempo real
app.get('/realtimeproducts', async (req, res) => {
  try {
    const products = await productsController.getProducts();
    res.render('realTimeProducts', { products: JSON.stringify(products) }); 
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

// Crear el servidor HTTP y pasarlo a Socket.IO
const server = http.createServer(app);
io.attach(server);

// Iniciar el servidor en el puerto 8080
const port = 8080;
server.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});