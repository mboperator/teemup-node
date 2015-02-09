// eventHelper.js
var

  q       = require('q'),

  Event   = require('../models/event'),

  parseHelper = require('./parseHelper'),

  tagHelper = require('./tagHelper'),

  _ = require('underscore'),

  _s = require('underscore.string'),

  exports = module.exports = {},

  TAG = "eventHelper:: ";



exports.processEvent = function(entry){
  console.log(TAG + "processEvent " + JSON.stringify(entry));
  var deferred = q.defer();
  // Look for existing event
  Event.findByName(entry["TITLE"][0], function(err, events){
    // If none found, create a new event
    console.log(TAG + "processEvent " + events.length);

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
      console.log(TAG + "processEvent " + JSON.stringify(events));
      deferred.resolve(events[0]);
    }
  });
  return deferred.promise;
}

function saveEvent(entry){
  console.log(TAG + " saveEvent " + JSON.stringify(entry));
  var deferred = q.defer();
  var title = _.unescape(entry["TITLE"][0]);
  var description = _s.stripTags(_.unescape(entry['EVENTS:DESCRIPTION'][0]));
  var organizer = _.unescape(entry['EVENTS:ORGANIZER'][0]);
  var url = entry["LINK"][0];
  var imageUrl = entry['EVENTS:MOBILEIMAGE'][0];
  var fullImageUrl = entry['EVENTS:IMAGE'][0];
  var ticketUrl = entry['EVENTS:TICKETS'][0];
  var startDate = parseHelper.processDate(entry['EVENTS:STARTDATE'][0], entry['EVENTS:TIME'][0]);
  var endDate = parseHelper.processDate(entry['EVENTS:STARTDATE'][0], entry['EVENTS:ENDTIME'][0]);
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

  parseHelper.processArray(entry['EVENTS:SUBJECTS'])
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


  parseHelper.processArray(entry['EVENTS:FEATURES'])
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
