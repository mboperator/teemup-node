// eventHelper.js
var

  q       = require('q'),

  Event   = require('../models/event'),

  parseHelper = require('./parseHelper'),

  tagHelper = require('./tagHelper'),

  _ = require('underscore'),

  exports = module.exports = {};



exports.processEvent = function(entry){
  var deferred = q.defer();
  // Look for existing event
  Event.findByName(entry.title[0], function(err, events){
    // If none found, create a new event

    if(events.length == 0){
      saveEvent(entry)
        .then(function(out){
          deferred.resolve(out);
        })
        .fail(function(err){
          console.log('Error in saving event ' + err);
          deferred.reject(err);
        });
    }
    else{
      deferred.resolve(events[0]);
    }
  });
  return deferred.promise;
}

function saveEvent(entry){
  var deferred = q.defer();
  var title = _.unescape(entry.title[0]);
  var description = _.unescape(entry['events:description'][0]);
  var organizer = _.unescape(entry['events:Organizer'][0]);
  var url = entry.link[0];
  var imageUrl = entry['events:MobileImage'][0];
  var fullImageUrl = entry['events:Image'][0];
  var ticketUrl = entry['events:Tickets'][0];
  var startDate = parseHelper.processDate(entry['events:startdate'][0], entry['events:time'][0]);
  var endDate = parseHelper.processDate(entry['events:startdate'][0], entry['events:EndTime'][0]);
  var event = new Event ({
    title: title,
    startDate: startDate,
    endDate: endDate,
    description: description,
    organizer: organizer,
    url: url,
    imageUrl: imageUrl,
    fullImageUrl: fullImageUrl,
    ticketUrl: ticketUrl
  });

  parseHelper.processArray(entry['events:Subjects'])
    .then(function(tags){
      event.tags = tags;
      tagHelper.checkUmbrella(tags)
        .then(function(umbrellas){
          event.umbrellas = umbrellas;
        });
    })
    .fail(function(err){
      console.log(err);
    });


  parseHelper.processArray(entry['events:Features'])
    .then(function(features){
      event.features = features;
    });

  event.save(function(err, event){
    if (err){
      console.log('Error in saving: ' + err);
      return deferred.reject(err);
    }
    return deferred.resolve(event);
  });

  return deferred.promise;
}
