// parseHelper.js

var

  q = require('q'),

  moment = require('moment-timezone'),

  exports = module.exports = {};

exports.processArray = function(array){
  var deferred = q.defer();
  var arrayParsed = [];
  if(array[0]){
    for(i=0; i < array[0].a.length; i++){
      arrayParsed[i] = array[0].a[i]._ || "Undefined";
    }
  }

  else{
    arrayParsed = ["Undefined"];
  }

  deferred.resolve(arrayParsed);
  return deferred.promise;
}

exports.processDate = function(date, time){
  var deferred = q.defer();
  var tz = moment().tz("America/Los_Angeles").format(' Z');
  var formattedDate = moment(date + ' ' + time + tz, "MM/DD/YYYY h:mm a ZZ ");
  return formattedDate;
}
