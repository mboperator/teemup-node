// server.js

// modules
var


  express     = require('express'),

  app         = express(),

  mongoose    = require('mongoose'),

  port        = process.env.PORT || 1337,

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
require('./app/controllers/tagController')(router);

app.use('', router);

// Run scrape
eventSrc.run();

// scrape schedule
eventSrc.schedule();

// rev your engines
app.listen(port);
console.log("we're live on port " + port);
exports = module.exports = app;