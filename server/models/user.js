'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    refreshtoken: DataTypes.STRING(1024)
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
