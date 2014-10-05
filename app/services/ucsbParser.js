// eventProcessor.js

var


  Event = require('../models/event'),

  Location = require('../models/location'),

  request = require('request'),

  moment = require('moment'),

  checkUmbrella = require('../util/tagHelper').checkUmbrella,

  parseHelper = require('../util/parseHelper'),

  jsonHelper = require('../util/jsonHelper'),

  url = "https://events.as.ucsb.edu/mobile-feed",
  
  q = require('q'),

  options = {};


function pullEvents(){
  console.log('UCSB Parser: Pulling Events'); 

  var deferred = q.defer();

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
    .then(jsonHelper.convertToJson)

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