// eventProcessor.js

var


  Event   = require('../models/event'),

  request    = require('request'),

  parser  = require('xml2js').parseString,
  
  q       = require('q'),

  options = {};


function saveEvents(out){
  var deferred = q.defer();
  console.log('UCSB Parser: Saving Events');
  new Event {
    title: out[id].title[0]),
    description: out[id].description[0]),
    organizer: out[id]['events:Organizer'][0]),
    image_url: out[id]['events:Image'][0])
  }
  deferred.resolve(out);
  return deferred.promise;
};

function convertToJson(out){
  console.log('UCSB Parser: Parsing Events'); 
  var deferred = q.defer();
  parser(out, {trim: true}, function (err, result){
    if (err) {
      deferred.reject(err);
    }
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
    .then(saveEvents)
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