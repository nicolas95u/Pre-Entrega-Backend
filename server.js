const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const exphbs = require('express-handlebars');
const productRouter = require('./routes/product.router');
const cartRouter = require('./routes/cart.router');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = 8080;
app.use(express.json());
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use('/products', productRouter);
app.use('/cart', cartRouter);

app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

io.on('connection', (socket) => {
    console.log('A client connected');

    socket.on('createProduct', (productData) => {
        io.emit('productCreated', productData);
    });

    socket.on('disconnect', () => {
        console.log('A client disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
