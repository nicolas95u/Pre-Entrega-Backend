const express = require('express');
const ProductManager = require('./ProductManager');

const app = express();
const PORT = 3000;

const productManager = new ProductManager('products.json');

app.get('/', (req, res) => {
    res.send('¡Bienvenido al servidor de productos!');
});

app.get('/products', async (req, res) => {
    try {
        const limit = req.query.limit;
        let products = await productManager.getProducts();

        if (limit) {
            const limitNum = parseInt(limit);
            products = products.slice(0, limitNum);
        }

        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

app.get('/products/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const product = await productManager.getProductById(productId);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener producto' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
