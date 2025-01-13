const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const user = require('../models/users');
const { check, validationResult } = require('express-validator');
const jwtSecret = process.env.SECRET_KEY;

const router = express.Router();

let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.username, //This is the username you're encoding in the JWT
    expiresIn: '7d', //specifies that the token will expire in 7 days
    algorithm: 'HS256', // used to 'sign' or encode the values of the JWT
  });
};

router.post(
  '/register',
  [
    check(
      'username',
      'Username is required and must be at least 5 characters'
    ).isLength({ min: 5 }),
    check(
      'username',
      'Username contains non alphanumeric characters - not allowed.'
    ).isAlphanumeric(),
    check('password', 'Password is required').not().isEmpty(),
    check('email', 'Email does not appear to be valid').isEmail(),
  ],
  async (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = user.hashPassword(req.body.password);
    await user
      .findOne({ username: req.body.username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.username + ' already exists');
        } else {
          user
            .create({
              username: req.body.username,
              password: hashedPassword,
              email: req.body.email,
            })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send('Error: ' + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  }
);

router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (error, user, info) => {
    if (error || !user) {
      return res.status(400).json({
        message: 'Something is not right',
        user: user,
      });
    }
    req.login(user, { session: false }, (error) => {
      if (error) {
        res.send(error);
      }
      let token = generateJWTToken(user.toJSON());
      return res.json({ user, token });
    });
  })(req, res, next);
});

module.exports = router;
