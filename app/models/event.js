var 

  mongoose = require('mongoose'),

  q = require('q'),

  Schema = mongoose.Schema,

  dateHelper = require('../util/dateHelper'),

  tagHelper = require('../util/tagHelper');

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
    .in(tagHelper.arrayForTag(tag))
    .populate('location')
    .exec(function(err, events){
      if(err)
        return deferred.reject(err);
      deferred.resolve(events);
    });
  return deferred.promise;
}

EventSchema.statics.findByPage = function(page){
  var deferred = q.defer();
  var offset = Math.max(0, page);
  var perPage = 20;

  var start = dateHelper.today();

  this.find()
    .where({endDate: {$gte: start}})
    .limit(perPage)
    .skip(perPage * page)
    .sort({'endDate': 'asc'})
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
    .in(tagHelper.arrayForTag(tag))
    .exec(function(err, count){
      if(err)
        return deferred.reject(err);
      deferred.resolve(count);
    });
  return deferred.promise;
}

EventSchema.statics.populateMissingUmbrellas = function(){
  this.find()
    .where({tags: {$not: {$size:0}}})
    .where({umbrellas: {$size: 0}})
    .exec(function(err, events){
      for(var key in events){
        tagHelper.checkUmbrella(events[key].tags);
        events[key].tags
      }
    });
}

module.exports = mongoose.model('Event', EventSchema);