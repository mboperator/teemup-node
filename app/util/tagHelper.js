var

  Event = require('../models/event'),

  q     = require('q'),

  _ = require('underscore'),

  tags  = {
    'artculture': ["University Events", "Humanities", "Art/Design", "Social Sciences"],
    'athletics': ["Athletics"],
    'lectures': ["Engineering/Technology", "Education", "Business", "Religious/Spiritual", "Law", "Science", "Environment"],
    'movies': ["Movies"],
    'performances': ["Theater & Dance", "Music", "Drama", "Comedy"],
    'workshops': ["Community/Public Service", "Careers", "Isla Vista Community"],
    'undefined': ["Undefined"]
  };

exports.checkUmbrella = function(input){
  var deferred = q.defer();
  var umbrellas = [];
  for(var key in tags){
    if(_.intersection(tags[key], input).length > 0){
      umbrellas.push(key);
    }
  }
  deferred.resolve(umbrellas);
  return deferred.promise;
}

exports.arrayForTag = function(tag){
  return tags[tag];
}

exports.tags = tags;