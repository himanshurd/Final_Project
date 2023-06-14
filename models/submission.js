const sequelize = require('../lib/sequelize')

const { DataTypes } = require('sequelize')

const Submission = sequelize.define('submissions', {
    id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    assignmentId: {type: DataTypes.INTEGER, allowNull: false},
    studentId: {type: DataTypes.INTEGER, allowNull: false},
    grade: { type: DataTypes.FLOAT, allowNull: true },
    file: { type: DataTypes.BLOB, length: "medium", allowNull: false }
})
exports.Submission = Submission

exports.SubmissionClientFields = [
    'assignmentId',
    'studentId',
    'grade',
    'file',
]