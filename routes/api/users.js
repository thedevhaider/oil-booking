const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const router = express.Router();

//Load the user model
const User = require("../../models/User.js");

// @routes     GET api/users/healthcheck
// @desc       Tests users routes
// @access     Public
router.get("/healthcheck", (req, res) => res.json({ user: "Users Working" }));

// @routes     POST api/users/register
// @desc       Tests register routes
// @access     Public
router.post("/register", (req, res) => {
  //Validate Register Inputs
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  //Find this request in the DB
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.user = "Already Exists";
      res.status(400).json(errors);
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => {
              user.blocked = undefined;
              user.password = undefined;
              res.json(user)
            })
            .catch(err => res.status(400).json({error: 'Error occured while registering user'}));
        });
      });
    }
  });
});

// @routes     POST api/users/login
// @desc       Tests Login
// @access     Public
router.post("/login", (req, res) => {
  //Validate Login Inputs
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  //Getting credentials from the req header
  const email = req.body.email;
  const password = req.body.password;

  //Checking in the database
  User.findOne({ email }).then(user => {
    //Check for user
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }

    //Check for password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //User Matched
        const payload = { name: user.name, id: user._id };

        //Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            if (err) throw err;
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        errors.password = "Password Incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

// @routes     GET api/users/current
// @desc       Returns current User
// @access     Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;
