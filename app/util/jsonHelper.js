// jsonHelper.js

var

  q = require('q'),

  Event = require('../models/event'),

  parser = require('xml2js').parseString,

  processEvent = require('./eventHelper').processEvent,

  processLocation = require('./locationHelper').processLocation,

  exports = module.exports = {};


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
}

exports.convertToJson = function(out){
  console.log('UCSB Parser: Parsing Events'); 

  var deferred = q.defer();

  console.log("jsonHelper:: " + out);

  parser(out, {trim: true, strict: false},
    function (err, result){
      if (err) return deferred.reject(err);
      // Parse JSON into Database
      console.log("jsonHelper:: ", JSON.stringify(result["RSS"]["CHANNEL"]));
      processJson(result["RSS"]["CHANNEL"]["0"]["ITEM"]);

      // Return Promise
      return deferred.resolve(result["RSS"]["CHANNEL"]["0"]["ITEM"]);
    }
  );
  return deferred.promise;
};  
