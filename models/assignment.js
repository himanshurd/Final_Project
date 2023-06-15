
const { DataTypes } = require('sequelize');
const {submission} = require('./submission')
const sequelize = require('../lib/sequelize');

const Assignment = sequelize.define('assignment', {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    courseId: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    points: { type: DataTypes.INTEGER, allowNull: false },
    due: { type: DataTypes.DATE, allowNull: false }
}) 
exports.Assignment = Assignment

/*
* one-to-many relationship between Assignemnts and Submissions
*/
Assignment.hasMany(Submission, { foreignKey: 'assignmentId' })
Submission.belongsTo(Assignment)

exports.AssignmentClientFields = [
    'id',
    'courseId',
    'title',
    'points',
    'due'
  ]