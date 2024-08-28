import ProductManager from "../dao/mongoDb/ProductManagerMongo.js";
import CartManager from "../dao/mongoDb/CartManagerMongo.js";
import User from '../models/user.js';
import logger from '../config/logger.js';

const productManager = new ProductManager();
const cartManager = new CartManager();

const renderRegister = (req, res) => {
  res.render("register");
};

const renderLogin = (req, res) => {
  res.render("login");
};

const renderProfile = (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  res.render("profile", { user: req.session.user });
};

const renderHome = async (req, res) => {
  try {
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const sort = req.query.sort || "";
    const products = await productManager.getProducts();

    if (sort === "asc") {
      products.docs.sort((a, b) => a.price - b.price);
    } else if (sort === "desc") {
      products.docs.sort((a, b) => b.price - a.price);
    }

    const paginatedProducts = products.docs.map(product => product.toObject());
    const totalPages = Math.ceil(products.docs.length / limit);

    res.render("home", {
      products: { docs: paginatedProducts },
      totalPages,
      page,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink:
        page > 1
          ? `/products?page=${page - 1}&limit=${limit}&sort=${sort}`
          : null,
      nextLink:
        page < totalPages
          ? `/products?page=${page + 1}&limit=${limit}&sort=${sort}`
          : null,
      user: req.session.user,
    });
  } catch (error) {
    logger.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

const renderProducts = async (req, res) => {
  try {
    const products = await productManager.getProducts();
    const clonedProducts = products.docs.map(product => product.toObject());
    logger.info('Productos que se envían a la vista:', clonedProducts);
    res.render("products", { products: { docs: clonedProducts } });
  } catch (error) {
    logger.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

const renderCart = async (req, res) => {
  try {
    const userId = req.session.user._id;
    
    let cart = await cartManager.getCartByUserId(userId);

    if (!cart) {
      const cartId = await cartManager.createCart(userId);
      cart = await cartManager.getCartById(cartId);
    }
   
   cart = {
    ...cart[0],
    products: cart[0].products.map(productEntry => ({
      quantity: productEntry.quantity,  // Extraemos y mantenemos quantity
      product: JSON.parse(JSON.stringify(productEntry.product))  // Aseguramos que product esté accesible
    })),
     };
    
    res.render("cart", { cart });
  } catch (error) {
    logger.error("Error al obtener el carrito:", error);
    res.status(500).json({ error: "Error al obtener el carrito" });
  }
};

const renderRealTimeProducts = (req, res) => {
  res.render("realTimeProducts");
};

const renderUserManagement = async (req, res) => {
  try {
    const users = await User.find({}, 'firstName lastName email role');
    res.render('userManagement', { users });
  } catch (error) {
    logger.error('Error al renderizar la vista de administración de usuarios:', error);
    res.status(500).json({ error: 'Error al renderizar la vista' });
  }
};

export default {
  renderRegister,
  renderLogin,
  renderProfile,
  renderHome,
  renderRealTimeProducts,
  renderUserManagement,
  renderProducts, 
  renderCart, 
};
