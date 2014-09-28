var Location   = require('./models/location');
// event controller
module.exports = function (router){
  router.route('/api/locations')


    .post(function(req, res) {
      var loc = new Location();
      loc.name = req.body.name;

      loc.save(function(err){
        if (err)
          res.send(err);
        res.json({ message: 'Location created!' });
      });
    })

    .get(function(req, res){
      Location.find(function(err, locations){
        if (err)
          res.send(err);
        res.json(locations);
      });
    });

  router.route('/api/locations/:location_id')

    .post(function(req, res) {
      Location.findById(req.params.event_id, function(err, location){
        location.update(req.body.location);
      })
    })
}