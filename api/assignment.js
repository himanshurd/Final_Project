var express = require('express');
var router = express.Router();
const multer = require('multer');

const {Assignment, AssignmentClientFields } = require('../models/assignment')

const crypto = require("node:crypto")
var fs = require('fs');
const { ValidationError } = require('sequelize')
const { Course } = require('../models/course')
const { User } = require('../models/user')
const { Submission, SubmissionClientFields, file } = require('../models/submission')
const { requireAuthentication } = require('../lib/auth')

const upload = multer({
    storage: multer.diskStorage({
      destination: `${__dirname}/../uploads`,
      filename: (req, file, callback) => {
          const filename = crypto.pseudoRandomBytes(16).toString("hex")
          const extension = file[file.type]
          callback(null, `${filename}.${extension}`)
      }
    }),
    fileFilter: (req, file, callback) => {
      callback(null, !!file[file.type]);
    }
  });
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

/*
 *  Update data for a specific Assignment.
 */
router.patch('/:id', async function (req, res) {
    const assignmentId = req.params.id
    try {  
      const result = await Assignment.update(req.body, {
      where: { id: assignmentId },
      fields: AssignmentClientFields
      })
      if (result[0] > 0) {
        res.status(200).json({"status": "okay"})
      } 
    } catch (err) {
      res.status(500).send(err)
    }
  
})
  
/*
 *  Route to delete a specific Assignment.
 */
router.delete('/:id', async function (req, res) {
    const assignmentId = req.params.id
    try {
      const result = await Assignment.destroy({ where: { id: assignmentId }})
      if (result > 0) {
        res.status(204).send()
      } 
    } catch (err) {
      res.status(500).send(err)
    }
    
})

/*
 *  Route to get a uploaded submitted file
 */
router.get('/submissions/:id/download', requireAuthentication, async function (req, res) {
  const submissionId = req.params.id
  try{
    const submission = await Submission.findByPk(submissionId)
    if(!submission){
      res.status(400).send("Submission is not existed for this id")
    }
    filestream.pipe(res);
  } catch {
    res.status(400).send("error downloading file.")
  }  
})

/*
 *  Route to return a list of submissions per assignment.
 */
router.get('/:id/submissions', requireAuthentication, async (req, res) => {
  const submissionId = req.params.id;

  try {
    const assignment = await Assignment.findByPk(submissionId);
    const course = await Course.findByPk(assignment.courseId);
    const instructor = await User.findByPk(course.instructorId);

    if (req.role === 'admin' || req.user === instructor.id) {
      let page = parseInt(req.query.page) || 1;
      page = page < 1 ? 1 : page;
      const num_per_page = 5;

      const result = await Submission.findAndCountAll({
        limit: num_per_page,
        offset: (page - 1) * num_per_page
      });
    } else {
      res.status(403).json({ error: 'Access denied' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/*
 * Route to create a new submission.
 */
router.post('/:id/submissions', requireAuthentication, upload.single('file'), async (req, res, next) => {
  const submissionId = req.param.id;
  const fileType = req.file.type;
  try {
    const submission = await Submission.create({
      'assignmentId': submissionId,
      'studentId': 2,
      'grade': 40,
      'file': fileType
    }, SubmissionClientFields);

    res.status(201).send({ id: submission.id });
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).send({ error: error.message });
    } else {
      throw error;
    }
  }
});




