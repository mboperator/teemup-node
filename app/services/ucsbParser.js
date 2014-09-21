// eventProcessor.js

var


  Event   = require('../models/event'),

  request    = require('request'),

  parser  = require('xml2js').parseString,

  moment = require('moment'),
  
  q       = require('q'),

  options = {};

function processArray(array){
  if(array[0]){
    var arrayParsed = [];
    for(i=0; i < array[0].a.length; i++){
      arrayParsed[i] = array[0].a[i]._ || "Undefined";
    }
  }
  else
    var arrayParsed = ["Undefined"];
  return arrayParsed;
};

function processDate(date, time){
  var formattedDate = moment(date + ' ' + time, "MM/DD/YYYY h:mm a");
  console.log(formattedDate);
  return formattedDate;
};


function processEvent(entry){
  var deferred = q.defer();
  Event.findByName(entry.title[0], function(err, events){
    if(events.length == 0){
      var title = entry.title[0];
      var description = entry['events:description'][0];
      var organizer = entry['events:Organizer'][0];
      var startDate = processDate(entry['events:startdate'][0], entry['events:time'][0]);
      var endDate = processDate(entry['events:startdate'][0], entry['events:EndTime'][0]);
      var tags = processArray(entry['events:Subjects']);
      var features = processArray(entry['events:Features']);
      var imageUrl = entry['events:Image'][0];

      var event = new Event ({
        
      });
      console.log('New event: ' + event.title);
      event.save(function(err){
        if (err){
          console.log('Error in saving: ' + err);
          return deferred.reject(err);
        }
        deferred.resolve(this);
      });
    }
  });
  return deferred.promise;
}

function processLocation(entry){
  var deferred = q.defer();
  Location.findByName(entry['events:Venue'],
    function(err, locations){
      if(locations.length == 0){
        var coords = {entry['events:VenueLat'][0], entry['events:VenueLong'][0]};
        var venueName = entry['events:Venue'][0];
        var location = new Location({
          name: venueName,
          coords: coords
        });
        console.log('New location: ' + location.name);
        location.save(function(err){
          if (err){
            console.log('Error in saving: ' + err);
            return deferred.reject(err);
          }
          deferred.resolve(this);
        });
      }
  });
  return deferred.promise;
}

function processJson(out){
  console.log('UCSB Parser: Saving Events');

  for (var id in out) {
    (function(id) {
      var entry = out[id];
      var processors = [];
      processors.push(processLocation(entry));
      processors.push(processEvent(entry));
      Q.all(promises)
        .then(function(results){
          var event = results[0];
          var location = results[1];
          event.location = location;
          event.save(function(err){
            if(err)
              console.log('Error in all: ' + err);
            else
              console.log('Event ' + event.name + ' processed!');
          });
        })
        .fail(function(err){
          console.log('Something happened in processing ' + err);
        })
    })(id);
  }
  };

function convertToJson(out){
  console.log('UCSB Parser: Parsing Events'); 
  var deferred = q.defer();
  parser(out, {trim: true}, function (err, result){
    if (err) {
      deferred.reject(err);
    }
    processJson(result.rss.channel[0].item);
    deferred.resolve(result.rss.channel[0].item);
  });
  return deferred.promise;
};  

function pullEvents(){
  console.log('UCSB Parser: Pulling Events'); 
  var deferred = q.defer();
  var url = "https://events.as.ucsb.edu/mobile-feed";
  request(url, function(err, res, body){
    if (err) {
      deferred.reject(err);
    }
    deferred.resolve(body);
  });

  return deferred.promise;
};

exports.refreshEvents = function(){
  console.log('UCSB Parser: Refreshing Events');
  var deferred = q.defer();
  pullEvents()
    .then(convertToJson)
    .then(function(out){
      console.log("UCSB Parser: Over and Out");
      return deferred.resolve(out);
    })
    .fail(function(err) {
      console.log("Failed to return events");
      return deferred.resolve(err)
    });
  return deferred.promise;
};