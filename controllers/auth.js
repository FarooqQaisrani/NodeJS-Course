exports.getLogin = (req, res, next) => {
  let Cookies = req.get("Cookie").split(";");
  let newCookies = {loggedIn : false};
  Cookies.map(element => {
    // console.log(element.split('=')[0]);
    const firstval = element.split("=")[0].trim(" ");
    const secondval = element.split("=")[1].trim(" ");

    const pair = { [firstval]: secondval };
    newCookies = { ...newCookies, ...pair };
  });

  // console.log(newCookies);

  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: newCookies.loggedIn === 'true HTTPonly'
  });
};

exports.postLogin = (req, res, next) => {
  res.setHeader("Set-Cookie", "loggedIn=true HTTPonly" );
  res.redirect("/");
};
