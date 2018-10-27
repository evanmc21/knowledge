const mongoose = require('mongoose');
const CONNECTION_URI = process.env.MONGODB_URI || 'mongodb://localhost/nodekb';
mongoose.Promise = global.Promise;
mongoose.set('debug', true);
mongoose.connect(CONNECTION_URI)
  .then(() => {
    console.log('Connected to MongoDB.');
  })
  .catch(err => console.log(err));

  exports.User = require('./models/User');
  exports.Article = require('./models/Article');
