//Himanshu Dhir
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

exports.UserClientFields = [
    'id',
    'courseId',
    'title',
    'points',
    'due'
  ]