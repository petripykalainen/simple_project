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
      {attributes: ['id', 'email']}
    );
  },
  GetUserToken: async (id) => {
    try {
      let user =  await User.findByPk(
        id,
        {attributes: ['refreshtoken']}
      );
      return user.refreshtoken;
    } catch (err) {
      throw new Error('DB error!');
    }
  },
  RemoveRefreshToken: async (id) => { 
    return await User.update({refreshtoken: null}, {where: {id}});
  },
  SaveRefreshToken: async (id, refreshtoken) => {
    try {
      return await User.update({refreshtoken}, {where: {id}})
    } catch (err) {
      throw new Error('DB error!');            
    }
  }
}
