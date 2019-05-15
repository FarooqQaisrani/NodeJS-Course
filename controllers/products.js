const Product = require('../models/product');


exports.getAdminProducts = (req, res, next) => {
  res.render('admin/products', {
    pageTitle: 'Add Product',
    path: '/admin/products',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true
  });
};

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true
  });
};


exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product(title, imageUrl, description, price);
  product.save();
  res.redirect('/');
};

exports.getHome = (req, res, next) => {
  Product.fetchAll((products)=> {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true
    });
  });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products)=> {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'Shop',
      path: '/products',
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true
    });
  });
};

exports.getProductDetail = (req, res, next) => {
  Product.fetchAll((products)=> {
    res.render('shop/product-detail', {
      prods: products,
      pageTitle: 'Shop',
      path: '/product-detail',
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true
    });
  });
};

exports.getCart = (req, res, next) => {
  Product.fetchAll((products)=> {
    res.render('shop/cart', {
      prods: products,
      pageTitle: 'Shop',
      path: '/cart',
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true
    });
  });
};