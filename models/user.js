//Himanshu Dhir
const { DataTypes } = require('sequelize');
const {submission} = require('./submission')
const sequelize = require('../lib/sequelize');

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: {type: DataTypes.TEXT, allowNull:false},
    role: {type: DataTypes.STRING, allowNull:false, enum: ['admin', 'instructor', 'student'], defaultValue: 'student'}

})

exports.User = User

exports.UserClientFields = [
    'id',
    'name',
    'email',
    'password',
    'role'
  ]