const express = require('express');
const router = express.Router();

// import User model
let User = require('../models/user');

// signup form
router.get('/signup', (req, res) => {
  res.render('signup');
})

module.exports = router;
