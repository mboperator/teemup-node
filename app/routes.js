// top level routes
module.exports = function (router){
  router.route('')
    .get(function(req, res){
      res.sendfile('./public/index.html');
    });
}