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

  router.route('/api/dates')
    .get(function(req, res){
    //   Event
    //     .dates()
    //     .then(function(out){
    //       res.send(out);
    //     })
    //     .fail(function(err){
    //       console.log("Error: " + err);
    //       res.send(404);
    //     });
      res.send({
        '2015-01-10': true,
        '2015-12-11': true,
        '2015-12-10': true,
        '2015-12-25': true,
        '2015-01-22': true,
        '2015-01-20': true,
        '2015-01-05': true,
        '2015-01-06': true,
        '2015-02-08': true
      });
    });

}