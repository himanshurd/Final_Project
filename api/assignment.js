// Himanshu Dhir
const { Router } = require('express')
const {AssignmentClientFields } = require('../models/business')

const { ValidationError } = require('sequelize')

/*
 * Route to create a new assignment.
 */
router.post('/', async function (req, res, next) {
    try {
      const assignment = await Assignment.create(req.body, AssignmentClientFields)
      res.status(201).send({ id: assignment.id })
    } catch (e) {
      if (e instanceof ValidationError) {
        res.status(400).send({ error: e.message })
      } else {
        throw e
      }
    }
  })

