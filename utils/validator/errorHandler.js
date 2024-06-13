const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
  
    const errorDictionary = {
      PRODUCT_NOT_FOUND: {
        status: 404,
        message: 'Producto no encontrado',
      },
      CART_NOT_FOUND: {
        status: 404,
        message: 'Carrito no encontrado',
      },
      OUT_OF_STOCK: {
        status: 400,
        message: 'Stock insuficiente para el producto',
      },
 
    };
  
    const errorResponse = errorDictionary[err.message] || {
      status: 500,
      message: 'Error interno del servidor',
    };
  
    res.status(errorResponse.status).json({ error: errorResponse.message });
  };
  
  module.exports = errorHandler;
  