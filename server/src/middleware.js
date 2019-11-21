const {VerifyToken, RefreshTokens} = require('./tokens.js');
const jwt = require('jsonwebtoken');
const DB = require('./db_sequelize');

module.exports = {
  ValidateTokens: async (req, res, next) => {

    // let token1 = req.headers['authorization'].split(' ')[1];
    let token1 = req.cookies['access-token1'];
    let token2 = req.cookies['access-token2'];

    // Check if tokens exists
    if (!token1 || !token2) {
      throw new Error('Unauthorized');
    }
    
    let atoken = token1+token2;

    try {
      // Check if token is still valid
      let accesstoken = await VerifyToken(atoken, process.env.JWT_ACCESS_SECRET);
      console.log(accesstoken.count)
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        try {
          let decoded = jwt.decode(atoken);
          // Token expired, check database for corresponding user and token
          let user  = await DB.GetUserToken(decoded.id);

          if (user && user.id === decoded.id) {
            let refreshtoken = await VerifyToken(
              user.refreshtoken, 
              process.env.JWT_REFRESH_SECRET
            );

            // Check if refreshtoken is valid and count and id match as well
            console.log(refreshtoken.count, decoded.count)
            if (refreshtoken.count === decoded.count && refreshtoken.id === decoded.id) {
              // Assign new tokens
              RefreshTokens(refreshtoken, res)
              return next();
            }

          }
        } catch (err) {
          return next(err);
        }
      }
      return next(err);
    }

    return next();
  }
  
}
