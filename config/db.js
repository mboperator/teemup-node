// config/db.js
  module.exports = {
    url: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/teemup';
  }