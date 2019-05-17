const path = require('path');

const express = require('express');

const productsConteroller = require('../controllers/products');

const router = express.Router();

router.get('/', productsConteroller.getHome);
router.get('/products', productsConteroller.getProducts);
router.get('/product-detail', productsConteroller.getProductDetail);
router.get('/cart', productsConteroller.getCart);
router.get('/orders', productsConteroller.getOrders);
router.get('/checkout', productsConteroller.getCheckout);

module.exports = router;
