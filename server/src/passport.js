require('dotenv').config();
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('./../models').User;

function initialize(passport) { 
  passport.use(new LocalStrategy({ 
    usernameField: 'email', 
    passwordField: 'password'
  }, async (email, password, done) => {  

    let user;
    
    try {
      user = await User.findOne({ where: { email }});

      if (!user) {
        return done(null, false);
      }

      let correctpw = await bcrypt.compare(password, user.password);
      
      if (!correctpw) {
        return done(null, false);
      }
      
    } catch (err) {
      return done(err)
    }

    return done(null, user);

  }));
}

module.exports = initialize;
