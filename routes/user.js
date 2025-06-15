const express = require("express");
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const router = express.Router({ mergeParams: true });
const userController = require("../controller/users");

router
  .route("/signup")
  .get((req, res) => {
    res.render("users/signup.ejs");
  })
  .post(wrapAsync(userController.signUp));

router
  .route("/signin")
  .get((req, res) => {
    res.render("users/signin.ejs");
  })
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/signin",
    }),
    wrapAsync(userController.signIn)
  );

router.get("/signout", userController.signOut);

module.exports = router;
