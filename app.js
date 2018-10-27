const express = require('express')
const path = require('path');
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session')

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

// middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')));

// express session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}));

// express messages middleware
app.use(require('connect-flash')());
app.use((req, res, next) => {
  // sets global variable 'messages' to express-messages module
  res.locals.messages = require('express-messages')(req, res);
  next();
})

// express validator middleware
app.use(expressValidator({
  errorFormater: (param, msg, value) => {
    let namespace = param.split('.')
    , root = namespace.shift()
    , formParam = root;

    while(namespace.length){
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

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

// add submit POST route
app.post('/articles/add', (req, res) => {
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
app.get('/article/:id', (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    res.render('article', {
      article: article
    });
  });
});

// edit single article
app.get('/article/edit/:id', (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    res.render('edit_article', {
      title: 'Edit Article',
      article: article
    });
  });
});

// update single article
app.post('/articles/edit/:id', (req, res) => {
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

app.delete('/article/:id', (req, res) => {
  let query = {_id:req.params.id}

  Article.remove(query, (err)=> {
    if(err){
      console.log(err);
    }
    res.send('Success!')
  });
});

// start server
app.listen(3000, () => {
  console.log('Server started on port 3000...')
});
