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

/*
 * Route to fetch info about a specific Assignment.
 */
router.get('/:id', async function (req, res) {
    const assignmentId = req.params.id
    const assignment = await Business.findByPk(assignmentId, {
    })
    if (assignment) {
      res.status(200).send(assignment)
    } else {
      res.status(404).json({"status": "Error 404 Assignment not found"})
    }
})


  

