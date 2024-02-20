const passport = require("passport");

module.exports = (app) => {

    function isLoggedIn(req, res, next) {
        req.user ? next() : res.sendStatus(401);
    }
    
  app.get(
    `/auth/google`,
    passport.authenticate("google", { scope: ["email", "profile"] })
  );

  app.get(
    `/google/callback`,
    passport.authenticate("google", {
      successRedirect: "/protected",
      failureRedirect: "/auth/failure",
    })
  );

  app.get(`/auth/failure`, (req, res) => {
    res.send("something went wrong");
  });

  app.get(`/protected`, isLoggedIn, (req, res) => {
    res.send(`Hello ${req.user.displayName}`);
  });

  app.get(`/logout`, (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
    });
    req.session.destroy();
    res.send("goodbye");
  });
};
