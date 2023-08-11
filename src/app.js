const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const ProductRoutes = require('./routes/productRoutes');
const CartRoutes = require('./routes/cartRoutes');
const ViewRoutes = require('./routes/viewRoutes');

// Configurar el motor de plantillas Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');

// Middleware para procesar el cuerpo de las solicitudes en formato JSON
app.use(express.json());

// Registrar las rutas de productos bajo /api/products
app.use('/api/products', ProductRoutes);

// Registrar las rutas de carritos bajo /api/carts
app.use('/api/carts', CartRoutes);

// Registrar las rutas de vistas
app.use('/', ViewRoutes);

// Configurar la conexión de sockets
io.on('connection', (socket) => {
  console.log('Usuario conectado');

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

// Iniciar el servidor en el puerto 8080
const port = 8080;
http.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});