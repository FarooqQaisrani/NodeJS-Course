const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./util/database");
const session = require('express-session');
var cookieParser = require('cookie-parser');
// initalize sequelize with session store
let SequelizeStore = require('connect-session-sequelize')(session.Store);


const errorController = require("./controllers/error");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "/dist/views"));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/dist/public"));
// app.use(session({secret: 'mysecret', resave: false, saveUninitialized: false}));
app.use(cookieParser())
app.use(session({
  secret: 'keyboard cat',
  store: new SequelizeStore({
    db: sequelize
  }),
  resave: false, // we support the touch method so per the express-session docs this should be set to false
  proxy: true ,// if you do SSL outside of node.
  // saveUninitialized: true
}));

app.use((req, res, next) => {

  // const user = new User(req.session.user);
  if(req.session.user != null){
    User.findByPk(req.session.user.id)
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => console.log(err));
  }
  else {
    next();
  }

  //
  // req.user = user;
  // next();


});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {through: OrderItem});


sequelize
  // .sync({force: true})
  .sync()
  // .then(result => {
  //   return User.findByPk(1);
  // })
  // .then(user => {
  //   if (!user) {
  //     return User.create({ name: "Max", email: "test@test.com" });
  //   }
  //   return Promise.resolve(user);
  // })
  // .then(user => {
  //   // console.log('user');
  //   return user.createCart();
  // })
  .then(cart => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
