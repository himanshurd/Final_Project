const sequelize = require('../lib/sequelize')
const { DataTypes } = require('sequelize')

const { Assignment } = require('./assignment')
const { User } = require('./user')

const Course = sequelize.define('course', {
  id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
  subject: { type: DataTypes.STRING, allowNull: false },
  number: { type: DataTypes.STRING, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  term: { type: DataTypes.STRING, allowNull: false },
  instructorId: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 1 }
})

exports.CourseClientFields = [
  'id',
  'subject',
  'number',
  'title',
  'term',
  'instructorId'
]
exports.Course = Course