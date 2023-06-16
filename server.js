const express = require('express');
const morgan = require('morgan');
const api = require('./api');
const sequelize = require('./lib/sequelize');
var { redisClient, rateLimit } = require('./lib/redis')
const app = express();
const port = process.env.PORT || 8000;

app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('public'));
app.use(rateLimit)
app.use('/api', api);

app.use('*', function (req, res, next) {
  res.status(404).json({
    error: "Requested resource " + req.originalUrl + " does not exist"
  });
});

app.use('*', function (err, req, res, next) {
  console.error("== Error:", err);
  res.status(500).send({
    error: "Server error. Please try again later."
  });
});

sequelize.sync().then(function () {
  app.listen(port, function () {
    console.log("== Server is listening on port:", port);
  });
});

redisClient.connect().then(function () {
  app.listen(6000);
})