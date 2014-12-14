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
    fullImageUrl: String,
    ticketUrl: String,
    location: { type: Schema.Types.ObjectId, ref: 'Location' }
  });

EventSchema.statics.findByName = function (name, cb){
  this.find({ title: new RegExp(name, 'i')}, cb);
};

EventSchema.statics.findBy = function(input){
  var deferred = q.defer();
  var start = dateHelper.today();
  var query = {};

  if(input.date){
    var start = { 
      endDate: {$gte: input.date}
    };

    var end = { 
      endDate: {$lte: dateHelper.addDay(input.date)}
    };

    if(input.tag){
      var tags = {
        tags: {$in: tagHelper.arrayForTag(input.tag)}
      };
      query = {
        $and: [start, end, tags]
      };
    }

    else{
      query = {
        $and: [start, end]
      };
    }

  }

  else if(!input.date && input.tag){
    query.tags = {
      $in: tagHelper.arrayForTag(input.tag)
    }
    query.endDate = { $gte: start };
  }

  else{
    query.endDate = { $gte: start };
  }
  
  this
    .find(query)
    .populate('location')
    .sort({'endDate': 'asc'})
    .exec(function(err, events){
      if(err)
        return deferred.reject(err);
      return deferred.resolve(events);
    });
  return deferred.promise;
}

EventSchema.statics.findByTag = function(tag){
  var deferred = q.defer();
  var start = dateHelper.today();
  
  this.find()
    .where('tags')
    .where({endDate: {$gte: start}})
    .in(tagHelper.arrayForTag(tag))
    .populate('location')
    .sort({'endDate': 'asc'})
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
    .populate('location')
    .sort({'endDate': 'asc'})
    .exec(function(err, events){
      if(err)
        return deferred.reject(err);
      deferred.resolve(events);
    });
  return deferred.promise;
}

EventSchema.statics.dates = function(){
  var deferred = q.defer();
  var start = dateHelper.today();

  this
    .find()
    .distinct('startDate')
    .where({endDate: {$gte: start}})
    .exec(function(err, events){
      if(err) return deferred.reject(err);
      var dict = {};

      for(var key in events){
        var date = events[key];
        date = dateHelper.dateToString(date);
        dict[date] = true;
      }

      return deferred.resolve(dict);
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
