import ProductManager from "../dao/mongoDb/ProductManagerMongo.js";
import User from '../models/user.js';
import logger from '../config/logger.js';

const productManager = new ProductManager();

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
      products.sort((a, b) => a.price - b.price);
    } else if (sort === "desc") {
      products.sort((a, b) => b.price - a.price);
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedProducts = products.slice(startIndex, endIndex);
    const totalPages = Math.ceil(products.length / limit);

    res.render("home", {
      products: paginatedProducts,
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
  } catch {
    res.status(500).json({ error: "Error al obtener productos" });
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
};
