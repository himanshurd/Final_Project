const express = require('express');
const router = express.Router();

router.use('/users', require('./user'));
router.use('/courses', require('./course'));
router.use('/assignments', require('./assignment'));

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

