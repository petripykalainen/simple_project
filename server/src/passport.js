require('dotenv').config();
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt;

const bcrypt = require('bcryptjs');
const User = require('./../models').User;

let init = {};

function initializeJwt(passport) {
  
  const cookieExtractor = (req) => {
    var token = null;
    console.log('cookie extractor:');
    // console.log(req.cookies)
    if (req && req.cookies)
    {
        token = req.cookies['access-token'];
    }
    console.log(token);
    return token;
  }

  var opts = {}
  opts.jwtFromRequest = cookieExtractor;
  opts.secretOrKey = process.env.JWT_ACCESS_SECRET;
  passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
    let user;
    
    try {
      // user = await User.FindOne({where: {email: jwt_payload.email}});
      console.log(jwt_payload)
      user = await User.findOne({ where: { email: jwt_payload.email } });
      if (user) {
    
        return done(null, user);
      } else {
    
        return done(null, false);
        // or you could create a new account
      }
    } catch (err) {
    
      return done(err, false);
    } 

  }));
}

function initializeLocal(passport) {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, async (email, password, done) => {

    let user;

    try {
      user = await User.findOne({ where: { email } });

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

init.initializeJwt = initializeJwt;
init.initializeLocal = initializeLocal;

module.exports = init;
