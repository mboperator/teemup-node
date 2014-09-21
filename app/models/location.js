var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var LocationSchema = new Schema({
  name: String,
  coords: { lat: Number, lng: Number }
});

LocationSchema.statics.findByName = function (name, cb){
  this.find({ name: name }, cb);
};

module.exports = mongoose.model('Location', LocationSchema);