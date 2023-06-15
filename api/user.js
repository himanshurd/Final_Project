const { Router } = require('express');
const router = Router();
const { ValidationError } = require('sequelize');
const { User, UserClientFields } = require('../models/user');
const { generateAuthToken, hashAndSaltPassword, validateUser, requireAuthentication } = require('../lib/auth');

/*
 * Route to create a new user.
 */
router.post('/', async (req, res) => {
  try {
    const password = req.body.password;
    const hashedPassword = await hashAndSaltPassword(password);
    const user = await User.create({ ...req.body, password: hashedPassword }, UserClientFields);
    res.status(201).send({ id: user.id });
  } catch (e) {
    if (e instanceof ValidationError) {
      res.status(400).send({ error: e.message });
    } else {
      throw e;
    }
  }
});

/*
 * Route to login a registered user.
 */
router.post('/login', async (req, res) => {
  if (req.body && req.body.email && req.body.password) {
    try {
      const authenticated = await validateUser(req.body.email, req.body.password);
      if (authenticated) {
        const token = generateAuthToken(req.body.userId);
        res.status(200).send({ token: token, message: "Successfully logged in" });
      } else {
        res.status(401).send({ error: "Access denied. Invalid Username or Password." });
      }
    } catch (err) {
      res.status(500).send({ error: "Server error. Please try again later." });
    }
  } else {
    res.status(400).send({ error: "Request is not valid. Please provide correct email and password." });
  }
});

/*
 * Route to get a user by id.
 */
router.get('/:id', requireAuthentication, async (req, res) => {
  const id = req.params.id;
  const user = await User.findByPk(id);

  if (user) {
    let courses = [];
    if (user.role === 'instructor') {
      courses = await Course.findAll({
        where: {
          instructorId: id
        },
        attributes: ['id']
      });
    } else if (user.role === 'student') {
      courses = await user.getCourses({
        attributes: ['id']
      });
    }
    res.status(200).json({
      name: user.name,
      email: user.email,
      role: user.role,
      courses: courses.map(course => course.id)
    });
  } else {
    res.status(404).json({ error: `User with id: ${id} not found` });
  }
});

module.exports = router;
