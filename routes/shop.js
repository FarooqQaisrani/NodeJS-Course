const path = require('path');

const express = require('express');

const productsConteroller = require('../controllers/products');

const router = express.Router();

router.get('/', productsConteroller.getProducts);

module.exports = router;
