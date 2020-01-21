const db = require('./../models');
const {User, Post} = db;

module.exports = {

  GetUsers: async () => {
    try {
      return await User.findAll();
      // return await User.findAll({attributes: ['id','firstName', 'lastName', 'email']});
    } catch (err) {
      throw new Error('DB error!')
    }
  },
  GetPosts: async () => {
    try {
      return await Post.findAll();
    } catch (err) {
      throw new Error('DB error!')
    }
  },
  GetUser: async (id) => {
    return await User.findByPk(
      id,
      {attributes: ['id','firstName', 'lastName', 'email']}
    );
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
