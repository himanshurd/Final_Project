//Himanshu Dhir
const { Router } = require('express')

const {ValidationError} = require('sequelize')
const {userInfo,UserClientFields} = require('../models/user')
const { generateAuthToken, hashAndSaltPassword, validateUser} = require('../lib/auth')

/*
* Route to create a new user.
*/
router.post('/', async (req, res) => {
    try {
      const user = await User.create(req.body, UserClientFields)
      res.status(201).send({ id: user.id })
      const Password = await hashAndSaltPassword(req.body.password)
      req.body.password = Password
    } catch (e) {
      if (e instanceof ValidationError) {
        res.status(400).send({ error: e.message })
      } else {
        throw e
      }
    }
})

/*
 * Route to login a registered user
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
        res.status(500).send({ error: "server error. Please try again later." });
      }
    } else {
      res.status(400).send({ error: "request is not vallid. Please provide correct email and password." });
    }
});



