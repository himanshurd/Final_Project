const { DataTypes } = require('sequelize');
const { Submission } = require('./submission');
const sequelize = require('../lib/sequelize');

const userInfo = sequelize.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.TEXT, allowNull: false },
  role: { type: DataTypes.STRING, allowNull: false, enum: ['admin', 'instructor', 'student'], defaultValue: 'student' }
});

exports.userInfo = userInfo;

/*
 * One-to-many relationship between User and Submission.
 */
userInfo.hasMany(Submission, { foreignKey: 'studentId' });
Submission.belongsTo(userInfo); 

exports.UserClientFields = [
  'id',
  'name',
  'email',
  'password',
  'role'
];
