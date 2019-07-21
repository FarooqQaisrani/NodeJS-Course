const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const User = require("../models/user");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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"
    }
  })
);

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
    errorMessage: req.flash("error")
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

  const email = req.body.email;
  const password = req.body.password;

  console.log(`Email: ${email} || Password: ${password}`);

  User.findOne({ where: { email: email } })
    .then(user => {
      if (!user) {
        req.flash("error", "Invalid email or password.");
        return res.redirect("/login");
      } else {
        bcrypt
          .compare(password, user.password)
          .then(doMatch => {
            if (doMatch) {
              console.log("setting session");
              req.session.isLoggedIn = true;
              req.session.user = user;
              return req.session.save(err => {
                console.log(err);
                res.redirect("/");
              });
            }

            res.redirect("/login");
          })
          .catch(err => {
            console.log(err);
            res.redirect("/login");
          });
      }
    })
    .catch(err => console.log(err));

  // User.findByPk(1)
  //   .then(user => {
  //     req.session.isLoggedIn = true;
  //     req.session.user = user;
  //     req.session.save(err => {
  //       console.log(err);
  //       res.redirect("/");
  //     });
  //   })
  //   .catch(err => console.log(err));
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
    errorMessage: req.flash("error")
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
        // console.log(userDoc);
        console.log("User Exist");
        req.flash(
          "error",
          "Email exists already, please pick a different one."
        );
        return res.redirect("/signup");
      } else {
        return bcrypt
          .hash(password, 12)
          .then(hashedPassword => {
            const user = new User({
              email: email,
              password: hashedPassword
            });
            return user.save();
          })
          .then(user => {
            return user.createCart();
          })
          .then(result => {
            res.redirect("/login");

            // return transporter
            //   .sendMail({
            //     to: "farooqqaisrani@outlook.com",
            //     from: "shop@node-complete.com",
            //     subject: "Signup succeeded!",
            //     html: `<h1>You successfully signed up!</h1>`
            //   })
            //   .catch(err => console.log(err));
          });
      }
    })
    .catch(err => console.log(err));
};
