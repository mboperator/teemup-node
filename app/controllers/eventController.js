// eventController.js

var 


  Event   = require('../models/event'),

  ep      = require('../services/eventProcessor'),

  parser  = require('rssparser'),

  eventSrc= require('../services/eventProcessor'),

  options = {};

// event controller
module.exports = function (router){

  router.get('/api/events', function(req, res, next){
    next()
  });

  router.route('/api/events')
    .get(function(req, res){
      eventSrc.refreshEvents(res);

      // Event.find(function(err, events){
      //   if (err) {
      //     return res.send(500);
      //     }
      //     return res.send(events);
      // });
    });

  router.route('/api/events/:event_id')

    .post(function(req, res) {
      Event.findById(req.params.event_id, function(err, eve){

      })
    })
}