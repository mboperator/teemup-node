// eventProcessor.js

var


  Event   = require('../models/event'),

  Location = require('../models/location'),

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
  return formattedDate;
};


function processEvent(entry){
  var deferred = q.defer();
  // Look for existing event
  Event.findByName(entry.title[0], function(err, events){

    // If none found, create a new event
    if(events.length == 0){
      var title = entry.title[0];
      var description = entry['events:description'][0];
      var organizer = entry['events:Organizer'][0];
      var startDate = processDate(entry['events:startdate'][0], entry['events:time'][0]);
      var endDate = processDate(entry['events:startdate'][0], entry['events:EndTime'][0]);
      var tags = processArray(entry['events:Subjects']);
      var features = processArray(entry['events:Features']);
      var url = entry.link[0];
      var imageUrl = entry['events:Image'][0];

      var event = new Event ({
        title: title,
        description: description,
        organizer: organizer,
        startDate: startDate,
        endDate: endDate,
        tags: tags,
        url: url,
        features: features,
        imageUrl: imageUrl
      });

      event.save(function(err){
        if (err){
          console.log('Error in saving: ' + err);
          return deferred.reject(err);
        }
        return deferred.resolve(this);
      });
    }

    // If event found, return that
    else
      return deferred.resolve(events[0]);
  });
  return deferred.promise;
}

function processLocation(entry){
  var deferred = q.defer();

  // Check if location exists already
  Location.findByName(entry['events:Venue'],
    function(err, locations){

      // If not, create a new location
      if(locations.length == 0){
        var
          lng = entry['events:VenueLong'][0],

          lat = entry['events:VenueLat'][0],

          coords = { lat: lat, lng: lng },

          venueName = entry['events:Venue'][0],

          location = new Location({
            name: venueName,
            coords: coords
          });

        // Save created location
        location.save(function(err, location){
          if (err){
            console.log('Error in saving: ' + err);
            return deferred.reject(err);
          }

          // Return promise with location instance
          deferred.resolve(location);
        });
      }

      // If location is found, return that
      else
        return deferred.resolve(locations[0]);
  });
  return deferred.promise;
}

function processJson(out){
  console.log('UCSB Parser: Saving Events');

  // Iterate through JSON Records
  for (var id in out) {
    (function(id) {
      var 
        entry = out[id],
        processors = [];

      // Process Event and Location for One Record
      processors.push(processEvent(entry));
      processors.push(processLocation(entry));

      // When all processing is complete, assign location
      q.all(processors)
        .then(function(results){

          if (results[0].location) {
            return;
          }

          var location = results[1];

          // find and update event location
          Event.findOneAndUpdate(
            { _id: results[0]._id },
            { location: location._id },
            function(err, doc) {
              if (err) {
                return console.log('An error occurred.', err);
              }
            }
          )
        }).fail(function(err){
          console.log('Something happened in processing ' + err);
        });
    })(id);
  }
  };

function convertToJson(out){
  console.log('UCSB Parser: Parsing Events'); 

  var deferred = q.defer();

  parser(out, {trim: true},
    function (err, result){
      if (err)
        deferred.reject(err);
      // Parse JSON into Database
      processJson(result.rss.channel[0].item);

      // Return Promise
      deferred.resolve(result.rss.channel[0].item);
    }
  );
  return deferred.promise;
};  

function pullEvents(){
  console.log('UCSB Parser: Pulling Events'); 

  var 
    deferred = q.defer(),
    url = "https://events.as.ucsb.edu/mobile-feed";

  request(url,
    function(err, res, body){
      if (err) {
        return deferred.reject(err);
      }
      deferred.resolve(body);
    });

  return deferred.promise;
};

exports.refreshEvents = function(){
  console.log('UCSB Parser: Refreshing Events');

  var deferred = q.defer();

  // Pull XML File
  pullEvents()

    // Turn XML to JSON
    .then(convertToJson)

    .then(
      function(out){
        console.log("UCSB Parser: Over and Out");
        return deferred.resolve(out);
      })

    .fail(
      function(err){
        console.log("Failed to return events " + err);
        return deferred.reject(err)
      });

  return deferred.promise;
};