var 

  Tag = require('../util/tagHelper'),

  q   = require('q'),

  Event = require('../models/event');


function buildTags(){
  var deferred = q.defer();
  var promises = [];
  var values = {};
  for (var key in Tag.tags){
    (function(key){
      values[key] = promises.push(tagQueue[key]) - 1;
    })(key);
  }
  q.allSettled(promises)
    .then(function(results){
      deferred.resolve(results);
    })
    .fail(function(err){
      console.log(err);
    })
  return deferred.promise;
}

// Tag controller
module.exports = function (router){
  router.route('/api/tags')
    .get(function(req, res){
      buildTags()
        .then(function(out){
          res.json(out);
        })
    });
}