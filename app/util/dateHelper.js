// dateHelper.js

var

  moment = require('moment-timezone'),

  exports = module.exports = {};


exports.today = function(){
  var today = new Date();
  today = moment().tz("America/Los_Angeles").toDate();
  return today;
}

exports.addDay = function(date){
  var result = moment(date).add(24, 'hours');
  return result;
}

exports.dateToString = function(date){
  return moment(date).format('YYYY-MM-DD');
}


exports.convertToPST = function(date){
  return moment(date).tz("America/Los_Angeles");
}
