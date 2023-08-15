const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const ProductRoutes = require('./routes/productRoutes');
const CartRoutes = require('./routes/cartRoutes');
const ViewRoutes = require('./routes/viewRoutes');
const ProductsController = require('./controllers/productsController');

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

// Registrar las rutas de las vistas
app.use('/', ViewRoutes);
app.use('/realTimeProducts', ViewRoutes);

io.on('connection', (socket) => {
  console.log('Usuario conectado al servidor de sockets');

  socket.on('disconnect', () => {
    console.log('Usuario desconectado del servidor de sockets');
  });

  // Emitir los productos actualizados en tiempo real
  async function emitUpdatedProducts() {
    try {
      const products = await productsController.getProducts();
      socket.emit('updateProducts', products);
    } catch (error) {
      console.error('Error al obtener los productos:', error);
    }
  }

  // Emitir los productos actualizados cuando se conecte un cliente
  emitUpdatedProducts();

  // Emitir los productos actualizados cada cierto intervalo de tiempo
  const interval = setInterval(emitUpdatedProducts, 5000); // Emitir cada 5 segundos

  // Limpiar el intervalo cuando el cliente se desconecta
  socket.on('disconnect', () => {
    clearInterval(interval);
  });
});

// Ruta estática para acceder a los archivos de la carpeta "data"
app.use('/data', express.static(path.join(__dirname, 'data')));

// Iniciar el servidor en el puerto 8080
const port = 8080;
http.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});

module.exports = io;