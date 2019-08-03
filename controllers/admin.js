const { validationResult } = require("express-validator");

const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  // console.log(req.session.user);
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    hasError: false,
    errorMessage: null
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  if (!image) {
    return res.render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/edit-product",
      editing: false,
      hasError: true,
      product: {
        title: title,
        price: price,
        description: description
      },
      errorMessage: "Attached file is not an image.",
      validationErrors: []
    });
  }
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/edit-product",
      editing: false,
      hasError: true,
      product: {
        title: title,
        price: price,
        description: description
      },
      errorMessage: errors.array()[0].msg
    });
  }

  const imageUrl = image.path;

  req.user
    .createProduct({
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description
    })
    .then(result => {
      // console.log("Created Product");
      // console.log(result);
      res.redirect("/admin/products");
    })
    .catch(err => {
      // res.redirect('/500');
      const error = new Error(err);
      error.httpStatusCode = 500;
      throw next(error);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  req.user
    .getProducts({ where: { id: prodId } })
    .then(products => {
      const product = products[0];
      if (!product) {
        return res.redirect("/");
      }

      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
        hasError: false,
        errorMessage: null
      });
    })
    .catch(err => {
      // res.redirect('/500');
      const error = new Error(err);
      error.httpStatusCode = 500;
      throw next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const image = req.file;
  const updatedDescription = req.body.description;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: true,
      hasError: true,
      product: {
        id: prodId,
        title: updatedTitle,
        price: updatedPrice,
        description: updatedDescription,
        userId: req.userId
      },
      errorMessage: errors.array()[0].msg
    });
  }

  Product.findByPk(prodId)
    .then(product => {
      // console.log('----------------------------');
      // console.log(product);
      // console.log('----------------------------');
      if (product.userId !== req.user.id) {
        return res.redirect("/");
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDescription;
      if (image) {
        product.imageUrl = image.path;
      }
      return product.save().then(result => {
        // console.log(result);
        res.redirect("/admin/products");
      });
    })
    .catch(err => {
      // res.redirect('/500');
      const error = new Error(err);
      error.httpStatusCode = 500;
      throw next(error);
    });
};

exports.getProducts = (req, res, next) => {
  req.user
    .getProducts()
    .then(products => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products"
      });
    })
    .catch(err => {
      // res.redirect('/500');
      const error = new Error(err);
      error.httpStatusCode = 500;
      throw next(error);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId)
    .then(product => {
      if (product.userId === req.user.id) {
        return product.destroy();
      }
    })
    .then(result => {
      // console.log("DESTRYOED PRODUCT");
      res.redirect("/admin/products");
    })
    .catch(err => {
      // res.redirect('/500');
      const error = new Error(err);
      error.httpStatusCode = 500;
      throw next(error);
    });
};
