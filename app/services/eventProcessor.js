// eventProcessor.js

var


  Event   = require('../models/event'),
  
  q       = require('q'),

  ucsb    = require('../services/ucsbParser'),

  options = {};


function aggregateEvents(){
  var deferred = q.defer();
  ucsb.refreshEvents()
    .then(function(out){
      console.log("Finished Aggregating Events.");
      return deferred.resolve(out);
    })
    .fail(function(err){
      console.log("Aggregate failed.");
      return deferred.reject(out);
    });
  return deferred.promise;
};

exports.refreshEvents = function(res){
  console.log('Event Processor: Refreshing Events');

  aggregateEvents()
    .then(function(out){
      console.log("Finished Processing Events.");
      res.send(out);
    })
    .fail(function(err){
      res.send(500, 'Event Processor: I broked it. ' + err);
    });
};