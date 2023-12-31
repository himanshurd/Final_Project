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
router.post('/', requireAuthentication, async function (req, res, next) {
  try {
    const assignment = await Assignment.create(req.body, AssignmentClientFields)
    const course = await Course.findByPk(assignment.courseId)
    const instructor = await User.findByPk(course.instructorId)
    if(req.role == 'admin' || req.user == instructor.id) {
      res.status(201).send({ id: assignment.id })
    } else {
      res.status(403).send("The request was not made by an authenticated User")
    }
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
    const assignment = await Assignment.findByPk(assignmentId, {
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
    } else {
      res.status(500).send("status error")
    }
  } catch (err) {
    res.status(500).send(err)
  }
})

/*
 *  Route to get a uploaded submitted file
 */
router.get('/submissions/:id/download', requireAuthentication, async function (req, res) {
  try{
    const submission = await Submission.findByPk(req.params.id)
    if(!submission){
      res.status(400).send("cannot find submission with that id")
    }
    var file = submission.filePath;
    var filename = file.split('.');
    var mimetype = submission.fileType;
  
    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.setHeader('Content-type', mimetype);
  
    var filestream = fs.createReadStream(file);
    filestream.pipe(res);
  } catch {
    res.status(400).send("error downloading file.")
  }  
})

/*
 *  Route to return a list of submissions per assignment.
 */
router.get('/:id/submissions', requireAuthentication, async function (req, res) {
  /*
   * Compute page number based on optional query string parameter `page`.
   * Make sure page is within allowed bounds.
   */
  const id = req.params.id
  // try to get assignment data
  try{ 
    const assignment = await Assignment.findByPk(id)
    const course = await Course.findByPk(assignment.courseId)
    const instructor = await User.findByPk(course.instructorId)

    // verify user matches requirements for query
    if (req.role == 'admin' || req.user == instructor.id){
      let page = parseInt(req.query.page) || 1
      page = page < 1 ? 1 : page
      const numPerPage = 10
      const offset = (page - 1) * numPerPage
    
      const result = await Submission.findAndCountAll({
        limit: numPerPage,
        offset: offset
      })

      /*
      * Generate HATEOAS links for surrounding pages.
      */
      const lastPage = Math.ceil(result.count / numPerPage)
      const links = {}
      if (page < lastPage) {
        links.lastPage = `/assignments/${id}/submissions?page=${lastPage}`
        links.nextPage = `/assignments/${id}/submissions?page=${page + 1}`
      } else if (page > 1) {
        links.prevPage = `/assignments/${id}/submissions?page=${page - 1}`
        links.firstPage = `/assignments/${id}/submissions?page=1`
      } else {
        links.firstPage = `/assignments/${id}/submissions?page=1`
      }
    
      /*
      * Construct and send response.
      */
      for (const subIndex in result.rows) {
        result.rows[subIndex].dataValues.downloadLink = `/assignments/submissions/${result.rows[subIndex].id}/download`
      }
      
      res.status(200).json({
        submissions: result.rows,
        pageNumber: page,
        totalPages: lastPage,
        pageSize: numPerPage,
        totalCount: result.count,
        links: links
      })
    } else {
      res.status(403).send("The request was not made by an authenticated User")
    } 
  } catch {
    res.status(404).send(`Specified Assignment with id: ${id} not found`)
  }
})

/*
 * Route to create a new submission.
 */
router.post('/:id/submissions', requireAuthentication, upload.single('file'), async function (req, res, next) {
  try {
    const submission = await Submission.create({
      'assignmentId': req.params.id,
      'studentId': 7, //get from authentication
      'grade': -1,
      'filePath': req.file.path,
      'fileType': req.file.mimetype
    }, SubmissionClientFields)
    res.status(201).send({ id: submission.id })
  } catch (e) {
    if (e instanceof ValidationError) {
      res.status(400).send({ error: e.message })
    } else {
      throw e
    }
  }
})
module.exports = router;