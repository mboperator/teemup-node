// eventController.js

var 


  Event   = require('../models/event'),
  
  eventSrc= require('../services/eventProcessor'),

  options = {};

// event controller
module.exports = function (router){

  router.get('/api/events', function(req, res, next){
    next()
  });

  router.route('/api/events')
    .get(function(req, res){
      console.log("Query strings " + JSON.stringify(req.query));
      var date = req.query.date;
      var tag = req.query.tag;
      var query = {
        date: date,
        tag: tag
      };
      Event
        .findBy(query)
        .then(function(out){
          res.send({'events': out});
        })
        .fail(function(err){
          console.log("Error: " + err);
          res.send(404);
        })
    });
}