// eventController.js

var 


  Event   = require('../models/event'),

  ep      = require('../services/eventProcessor'),

  eventSrc= require('../services/eventProcessor'),

  options = {};

// event controller
module.exports = function (router){

  router.get('/api/events', function(req, res, next){
    next()
  });

  router.route('/api/events')
    .get(function(req, res){

      Event
        .find({})
        .populate('location')
        .exec(function(err, events) {
          if (err) {
            console.log('events error ' + err);
            return res.send(500);
          }
          return res.send({'events': events});
        });
    });

  router.route('/api/events/:tag')
    .get(function(req, res) {
      
      Event
        .findByTag(req.params.tag)
        .then(function(out){
          res.send(out);
        })
        .fail(function(err){
          res.send(404);
        })
    });
}