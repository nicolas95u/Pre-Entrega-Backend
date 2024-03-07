const express = require('express');
const ProductManager = require('./ProductManager');

const app = express();
const PORT = 3000;

const productManager = new ProductManager('./products.json');


const errorHandler = (res, error) => {
    console.error('Error:', error);
    res.status(500).json({ error: error.message || 'Error desconocido' });
};

app.get('/products', async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        let products = await productManager.getProducts();

        if (!isNaN(limit)) {
            products = products.slice(0, limit);
        }

        res.json(products);
    } catch (error) {
        errorHandler(res, error);
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
        errorHandler(res, error);
    }
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
