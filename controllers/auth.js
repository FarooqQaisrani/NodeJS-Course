const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const mailtrap = require("../config/apiKeys.js");

const User = require("../models/user");

const transporter = nodemailer.createTransport(mailtrap);

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

  User.findOne({
    where: {
      email: email
    }
  })
    .then(userDoc => {
      // if (userDoc.length === 0) {
      //   console.log("No User");
      // }

      if (userDoc) {
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

            const mailOptions = {
              from: '"Node Shop" <shop@node-complete.com>',
              to: email,
              subject: "Signup succeeded!",
              html: `<h1>You successfully signed up!</h1>`
            };

            return transporter.sendMail(mailOptions, (err, info) => {
              if (err) {
                console.log(err);
                return next(err);
              }
              // console.log("Info: ", info);
              res.json({
                message: "Email successfully sent."
              });
            });
          });
      }
    })
    .catch(err => console.log(err));
};

exports.getReset = (req, res, next) => {
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: req.flash("error")
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({
      where: {
        email: req.body.email
      }
    })
      .then(user => {
        if (!user) {
          req.flash("error", "No account with that email found");
          return res.redirect("/reset");
        }

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 60 * 60 * 1000;
        return user.save();
      })
      .then(user => {
        res.redirect("/");
        const mailOptions = {
          from: '"Node Shop" <shop@node-complete.com>',
          to: user.email,
          subject: "Password reset",
          html: `
                <p>You requested a password reset</p>
                <p>Click this <a href="http://localhost:5000/reset/${token}">link</a> to set a new password.</p>
                `
        };

        return transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.log(err);
            return next(err);
          }
          // console.log("Info: ", info);
          res.json({
            message: "Email successfully sent."
          });
        });
      })
      .catch(err => console.log(err));
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({
    where: {
      resetToken: token
      // resetTokenExpiration: { $gt: Date.now() }
    }
  })
    .then(user => {
      console.log(`user ${user}`);
      console.log(`user ${Date(new Date().toLocaleString())}`);

      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "New Password",
        errorMessage: req.flash("error"),
        userId: user.id,
        passwordToken: token
      });
    })
    .catch(err => console.log(err));
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    where: {
      resetToken: passwordToken,
      id: userId,
      // resetTokenExpiration: { $gt: Date.now() }
    }
  })
    .then(user => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = null;
      resetUser.resetTokenExpiration = null;
      return resetUser.save();
    })
    .then(user => {
      res.redirect("/login");
    })
    .catch(err => {
      console.log(err);
    });
};
