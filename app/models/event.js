var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var EventSchema = new Schema({
  title: String,
  description: String,
  organizer: String,
  date: { type: Date, default: Date.now },
  tags: [ String ],
  features: [ String ],
  url: String,
  image_url: String,
  location: mongoose.Schema.Types.ObjectId
});

module.exports = mongoose.model('Event', EventSchema);