const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const adminData = require('./admin');

const router = express.Router();


router.get('/', (req, res, next) => {
  console.log(adminData.products);
  // console.log('Start middleware!');
  res.sendFile(path.join(rootDir, 'views', 'shop.html'));
});

module.exports = router;

