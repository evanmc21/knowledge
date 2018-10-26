const express = require('express')
const path = require('path');
const mongoose = require('mongoose')

// establish database connection
mongoose.connect('mongodb://localhost/nodekb')
let db = mongoose.connection;

// init app
const app = express();

// load view engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug');

// Home Route
app.get('/', (req, res) => {
  let articles = [
    {
      id:1,
      title:'Article One',
      author: 'Evan Candler',
      body: 'this is article one'
    },
    {
      id:2,
      title:'Article One',
      author: 'Evan Michael',
      body: 'this is article two'
    },
    {
      id:3,
      title:'Article One',
      author: 'Evan Candler',
      body: 'this is article three'
    }
  ];
  res.render('index', {
    title: 'Articles',
    articles: articles
  });
});

// add route
app.get('/articles/add', (req, res) => {
  res.render('add_article', {
    title: 'Add Article'
  });
});
// start server
app.listen(3000, () => {
  console.log('Server started on port 3000...')
});
