const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  let Cookies = req.get("Cookie").split(";");
  let newCookies = { loggedIn: false };
  Cookies.map(element => {
    // console.log(element.split('=')[0]);
    const firstval = element.split("=")[0].trim(" ");
    const secondval = element.split("=")[1].trim(" ");

    const pair = { [firstval]: secondval };
    newCookies = { ...newCookies, ...pair };
  });
  console.log(`req.session.isLoggedIn :${req.session.isLoggedIn}`);
  // console.log(newCookies);

  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  // req.session.isLoggedIn = true;
  // let user;
  //
  // User.findByPk(1)
  //   .then(user => {
  //     if (!user) {
  //       return User.create({ name: "Max", email: "test@test.com" });
  //     }
  //     this.user = user;
  //     return Promise.resolve(user);
  //   })
  //   .then(user => {
  //     // console.log('user');
  //     return user.createCart();
  //   })
  //   .then(result => {
  //     req.session.isLoggedIn = true;
  //     req.session.user = user;
  //     res.redirect("/");
  //   })
  //   .catch(err => console.log(err));

  User.findByPk(1)
    .then(user => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save(err => {
        console.log(err);
        res.redirect("/");
      });
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User.findAll({
    where: {
      email: email
    }
  })
    .then(userDoc => {
      // if (userDoc.length === 0) {
      //   console.log("No User");
      // }

      if (userDoc.length > 0) {
        console.log(userDoc);
        return res.redirect("/signup");
      } else {
        const user = new User({
          email: email,
          password: password,
          cart: { items: [] }
        });

        return user.save();
      }


    })
    .then(result => {
      res.redirect("/login");
    })
    .catch(err => console.log(err));
};
