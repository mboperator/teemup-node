var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var LocationSchema = new Schema({
  name: String,
  description: String,
  pic_url: String,
  coords: { lat: Number, lng: Number }
});

module.exports = mongoose.model('Event', EventSchema);