// dateHelper.js

var

  moment = require('moment'),

  exports = module.exports = {};


exports.today = function(){
  var today = new Date();
  today = moment().toDate();
  return today;
}