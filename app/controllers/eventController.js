// eventController.js

var 


  Event   = require('../models/event'),
  
  eventSrc= require('../services/eventProcessor'),

  q = require('q'),

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

          // Cat photos
          out.map(function(doc){
            var deferred = q.defer();
            if (doc.imageUrl === "") {
              doc.imageUrl = "http://lorempixel.com/g/640/520/cats/g/";
              doc.fullImageUrl = "http://lorempixel.com/g/640/520/cats/g/";
            }
            deferred.resolve(doc);
            return deferred.promise;
          });
          // END CAT PHOTOS
          q.all(out)
            .then(function(results){
              res.send({'events': out});
            })
            .fail(function(err){
              console.log("Error", err);
            });
        })
        .fail(function(err){
          console.log("Error: " + err);
          res.send(404);
        })
    });

  router.route('/api/dates')
    .get(function(req, res){
      Event
        .dates()
        .then(function(out){
          res.send(out);
        })
        .fail(function(err){
          console.log("Error: " + err);
          res.send(404);
        });
    });
}
