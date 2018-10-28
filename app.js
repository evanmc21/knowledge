const express = require('express')
const path = require('path');
const mongoose = require('mongoose');
const CONNECTION_URI = process.env.MONGODB_URI || 'mongodb://localhost/nodekb';
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const config = require('./config/database');

// establish database connection
mongoose.connect(CONNECTION_URI)
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
const PORT = process.env.PORT || 3000;

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
    saveUninitialized: true,
    secret: 'keyboard cat',
    resave: true,
    store: new MongoStore({
      url: 'mongodb://localhost/nodekb',
      ttl: 14 * 24 * 60 * 60 // = 14 days. Default
    })
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

app.get('*', (req, res, next) => {
  res.locals.user = req.user || null;
  next();
});
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
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
});
