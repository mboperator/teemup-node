// locationHelper.js

var
  
    q = require('q'),

    Location = require('../models/location'),

    locationQueue = {},

    exports = module.exports = {};

exports.processLocation = function(entry){
  var 
    deferred = q.defer(),
    venueName = entry['EVENTS:VENUE'][0];

  // check if querying / queried for venue already
  if (locationQueue[venueName]) {
    return locationQueue[venueName];
  }

  // add deferred to queue
  locationQueue[venueName] = deferred.promise;

  // Check if location exists already
  Location.findByName(venueName,
    function(err, locations){
      // If not, create a new location
      if(locations.length == 0){
        var
          lng = entry['EVENTS:VENUELONG'][0],

          lat = entry['EVENTS:VENUELAT'][0],

          coords = { lat: lat, lng: lng },

          venueName = entry['EVENTS:VENUE'][0],

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
