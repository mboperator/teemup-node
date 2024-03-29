// eventProcessor.js

var


  Event   = require('../models/event'),
  
  q       = require('q'),

  schedule = require('node-schedule'),

  ucsb    = require('../services/ucsbParser'),

  exports = module.exports = {};

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
      return deferred.reject(err);
    });
  return deferred.promise;
}

function refreshEvents(){
  console.log('Event Processor: Refreshing Events');

  aggregateEvents()
    .then(function(out){
      console.log("Finished Processing Events.");
    })
    .fail(function(err){
      console.log('Event Processor: I broked it. ' + err);
    });
}

// Schedules scrape @ 7am every day

exports.schedule = function(){
  var rule = new schedule.RecurrenceRule();
  rule.hour = 7;
  schedule.scheduleJob(rule, function(){
    console.log("Scheduled scrape running");
    refreshEvents();
  });
  console.log("Scrape scheduled");
}

exports.run = function(){
  refreshEvents();
  console.log("Scraping now");
}