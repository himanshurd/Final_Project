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





