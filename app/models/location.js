var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var LocationSchema = new Schema({
  name: String,
  coords: { lat: Number, lng: Number }
});

module.exports = mongoose.model('Event', EventSchema);