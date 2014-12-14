// dateHelper.js

var

  moment = require('moment'),

  exports = module.exports = {};


exports.today = function(){
  var today = new Date();
  today = moment().toDate();
  return today;
}

exports.addDay = function(date){
  var result = moment(date).add(24, 'hours');
  return result;
}

exports.dateToString = function(date){
  return moment(date).format('YYYY-MM-DD');
}


exports.shiftDate = function(date){
  return moment(date).subtract(8, 'hours');
}