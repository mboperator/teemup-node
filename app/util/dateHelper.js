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
  var result = moment(date).endOf("day");
  console.log("Start " + moment(date).toISOString());
  console.log("End " + result.toISOString());
  return result;
}

exports.dateToString = function(date){
  return moment(date).format('YYYY-MM-DD');
}