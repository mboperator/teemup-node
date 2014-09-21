var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var EventSchema = new Schema({
  title: String,
  description: String,
  organizer: String,
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, default: Date.now },
  tags: [ String ],
  features: [ String ],
  url: String,
  imageUrl: String,
  location: mongoose.Schema.Types.ObjectId
});

EventSchema.statics.findByName = function (name, cb){
  this.find({ name: new RegExp(name, 'i')}, cb);
};

module.exports = mongoose.model('Event', EventSchema);