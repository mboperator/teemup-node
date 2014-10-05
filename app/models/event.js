var 

  mongoose    = require('mongoose'),

  q           = require('q'),

  Schema      = mongoose.Schema,

  arrayForTag = require('../util/tagHelper').arrayForTag;

  EventSchema = new Schema({
    title: String,
    description: String,
    organizer: String,
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: Date.now },
    tags: [ String ],
    umbrellas: [ String ],
    features: [ String ],
    url: String,
    imageUrl: String,
    location: { type: Schema.Types.ObjectId, ref: 'Location' }
  });

EventSchema.statics.findByName = function (name, cb){
  this.find({ title: new RegExp(name, 'i')}, cb);
};

EventSchema.statics.findByTag = function(tag){
  var deferred = q.defer();
  this.find()
    .where('tags')
    .in(arrayForTag(tag))
    .populate('location')
    .exec(function(err, events){
      if(err)
        return deferred.reject(err);
      deferred.resolve(events);
    });
  return deferred.promise;
}

EventSchema.statics.countByTag = function(tag){
  var deferred = q.defer();
  this.count()
    .where('tags')
    .in(arrayForTag(tag))
    .exec(function(err, count){
      if(err)
        return deferred.reject(err);
      deferred.resolve(count);
    });
  return deferred.promise;
}

module.exports = mongoose.model('Event', EventSchema);