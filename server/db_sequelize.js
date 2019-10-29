const db = require('./models');
const User = db.User;

module.exports = {

  GetUsers: async () => {
    let users = await User.findAll();
    return users;
  }

}
