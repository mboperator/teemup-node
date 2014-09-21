// server.js

// modules
var


  express     = require('express'),

  app         = express(),

  mongoose    = require('mongoose'),

  port        = process.env.PORT || 5858,

  bodyParser  = require('body-parser'),

  db          = require('./config/db'),

  eventSrc    = require('./app/services/eventProcessor'),

  router      = express.Router();


app.use(bodyParser());

// database config
mongoose.connect(db.url);

// routes
require('./app/routes')(router);
require('./app/controllers/eventController')(router);

app.use('', router);

// rev your engines

app.listen(port);
console.log("we're live on port " + port);
exports = module.exports = app;