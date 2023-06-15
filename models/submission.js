const { DataTypes } = require('sequelize')
const sequelize = require('../lib/sequelize')

const Submission = sequelize.define('submissions', {
    id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    assignmentId: {type: DataTypes.INTEGER, allowNull: false},
    studentId: {type: DataTypes.INTEGER, allowNull: false},
    timestamp: {type: DataTypes.DATE,allowNull: false},
    grade: { type: DataTypes.FLOAT, allowNull: true },
    file: { type: DataTypes.STRING, allowNull: false }
})
exports.Submission = Submission
exports.SubmissionClientFields = [
    'assignmentId',
    'studentId',
    'timestamp',
    'grade',
    'file'
]

exports.file = {
    "text/csv": "csv",
}