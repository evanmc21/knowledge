const express = require('express')
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');

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

// passport configuration
require('./config/passport')(passport)
// passport middleware
app.use(passport.initialize());
app.use(passport.session());

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

// connect route files
let articles = require('./routes/articles');
let users = require('./routes/users');
app.use('/articles', articles)
app.use('/users', users)

// start server
app.listen(3000, () => {
  console.log('Server started on port 3000...')
});
