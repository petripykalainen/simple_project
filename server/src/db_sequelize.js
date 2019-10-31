const db = require('./../models');
const User = db.User;

module.exports = {

  GetUsers: async () => {
    let users = await User.findAll();
    return users;
  },
  GetUserbyEmail: async (email) => {
    console.log('INSIDE DB!')
    let user = await User.findOne({where:{email}})
    return user;
  }

}
