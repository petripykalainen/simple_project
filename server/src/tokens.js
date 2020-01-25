const jwt = require('jsonwebtoken');
const {User} = require('../models')

module.exports = {
  VerifyToken: (token, secret) => {
    return new Promise(function(resolve, reject){
      jwt.verify(token, secret, function(err, decode){
        if (err){
          reject(err)
          return
        }
        resolve(decode)
      })
    })
  },
  CreateAccessToken: (email, id) => {
    let user = {
      id,
      email
    }
    return jwt.sign(user, process.env.JWT_ACCESS_SECRET, {
      expiresIn: '1min'
    });
  },
  CreateRefreshToken: (email, id) => {
    let user = {
      id,
      email
    }
    return jwt.sign(user, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '7d'
    });
  },
  RefreshAccesstoken: (token, res) => {
    let {email, id} = token;
    let accessToken = module.exports.CreateAccessToken(email, id);
    // let refreshToken = module.exports.CreateRefreshToken(email, id);

    // User.update({refreshtoken: refreshToken}, {where: {id}});

    let newToken1 = accessToken.slice(0, accessToken.indexOf('.', (accessToken.indexOf('.')+1))+1);
    let newToken2 = accessToken.slice(accessToken.indexOf('.', (accessToken.indexOf('.')+1))+1);

    res.cookie('access-token1', newToken1, {maxAge: 1000*60*60*24*7});  // 7d
    res.cookie('access-token2', newToken2, {maxAge: 1000*60*60*24*7, httpOnly: true });
  }
}
