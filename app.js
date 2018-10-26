const express = require('express')
const path = require('path');
const mongoose = require('mongoose')

// establish database connection
mongoose.connect('mongodb://localhost/nodekb')
let db = mongoose.connection;

// check connection
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// check for DB errors
db.on('error', () => {
  console.log(err);
});

// init app
const app = express();

// import models
let Article = require('./models/article')
// load view engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug');

// Home Route
app.get('/', (req, res) => {
  Article.find({}, (err, articles) => {
    // check for errors
    if(err){
      console.log(err);
    } else {
      res.render('index', {
        title: 'Articles',
        articles: articles
      });
    }
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
