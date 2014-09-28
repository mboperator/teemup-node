// config/db.js
var url = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/teemup';
module.exports = {
  url: url
}