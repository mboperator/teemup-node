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
  location: { type: Schema.Types.ObjectId, ref: 'Location' }
});

EventSchema.statics.findByName = function (name, cb){
  this.find({ title: new RegExp(name, 'i')}, cb);
};

EventSchema.statics.findByTag = function(tag, cb){
  switch(tag) {
    case "artculture":
      tags = ["University Events", "Humanities", "Art/Design", "Social Sciences"];
      break;
    case "athletics":
      tags = ["Athletics"];
      break;
    case "lectures":
      tags = ["Engineering/Technology", "Education", "Business", "Religious/Spiritual", "Law", "Science", "Environment"];
      break;
    case "movies":
      tags = ["Movies"];
      break;
    case "performances":
      tags = ["Theater & Dance", "Music", "Drama", "Comedy"];
      break;
    case "workshops":
      tags = ["Community/Public Service", "Careers", "Isla Vista Community"];
      break;

    default:
      break;
  }

  this.find()
    .where('tags')
    .in(tags)
    .exec(cb);
}

module.exports = mongoose.model('Event', EventSchema);