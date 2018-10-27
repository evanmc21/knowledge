const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();


// import User model
let User = require('../models/user');

// signup form
router.get('/signup', (req, res) => {
  res.render('signup');
})

// signup route
router.post('/signup', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Sorry, Charlie. It looks like that is not a valid email.').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', "It looks like the passwords don't match").notEmpty();

  let errors = req.validationErrors();

  if(errors){
    res.render('signup', {
      errors: errors
    });
  } else {
    let newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password
    });

// generate salt
    bcrypt.genSalt(10, (err, salt) => {
      // password is stored in a hash.
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if(err){
          console.log(err);
        }
        newUser.password = hash;
        newUser.save((err) => {
          if(err){
            console.log(err);
            return;
          } else {
            req.flash('success', "You've successfully signed up! Please login.")
            res.redirect('/users/login');
          }
        });
      });
    });
  }
  router.get('/login', (req, res) => {
    res.render('login');
  });
});

  router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();

    let errors = req.validationErrors();

  })

module.exports = router;
