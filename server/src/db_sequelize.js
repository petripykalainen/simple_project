const db = require('./../models');
const User = db.User;

module.exports = {

  GetUsers: async () => {
    try {
      return await User.findAll();
      // return await User.findAll({attributes: ['id','firstName', 'lastName', 'email']});
    } catch (err) {
      throw new Error('DB error!')
    }
  },
  GetUser: async (id) => {
    try {
      return await User.findByPk(
        id,
        {attributes: ['id','firstName', 'lastName', 'email']}
      );
    } catch (err) {
      throw new Error('DB error!')      
    }
  },
  GetUserToken: async (id) => {
    try {
      return await User.findByPk(
        id,
        {attributes: ['id','refreshtoken']}
      );  
    } catch (err) {
      throw new Error('DB error!');
    }
  },
  RemoveRefreshToken: async (id) => {
    try {
      return await User.update({refreshtoken: null}, {where: {id}});
    } catch (err) {
      throw new Error('DB error!');      
    }
  }
  
}
