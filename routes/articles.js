const express = require('express');
const router = express.Router();

// import Article model
const Article = require('../models/article');

// add route
router.get('/add', (req, res) => {
  res.render('add_article', {
    title: 'Add Article'
  });
});

// add submit POST route
router.post('/add', (req, res) => {
  req.checkBody('title', 'Title is required').notEmpty();
  req.checkBody('author', 'Author is required').notEmpty();
  req.checkBody('body', 'Body is required').notEmpty();

// get errors
let errors = req.validationErrors();
if(errors){
  res.render('add_article', {
    title: 'Add Article',
    errors: errors
  });
} else {
  let article = new Article();
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  article.save((err) => {
    if(err){
      console.log(err);
      return;
    } else {
      req.flash('success', "You've Added the Article!")
      res.redirect('/');
      }
    });
  }
});

// get single article
router.get('/:id', (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    res.render('article', {
      article: article
    });
  });
});

// edit single article
router.get('/edit/:id', (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    res.render('edit_article', {
      title: 'Edit Article',
      article: article
    });
  });
});

// update single article
router.post('/edit/:id', (req, res) => {
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  let query = {_id:req.params.id}

  Article.updateOne(query, article, (err) => {
    if(err){
      console.log(err);
      return;
    } else {
      req.flash('success', "You've Updated the Article!")
      res.redirect('/');
    }
  });
});

router.delete('/:id', (req, res) => {
  let query = {_id:req.params.id}

  Article.remove(query, (err)=> {
    if(err){
      console.log(err);
    }
    res.send('Success!')
  });
});

module.exports = router;
