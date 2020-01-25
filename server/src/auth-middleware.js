const {VerifyToken, RefreshAccesstoken} = require('./tokens.js');
const jwt = require('jsonwebtoken');
const DB = require('./db_sequelize');

module.exports = {
  authenticate: (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({msg: 'Unauthorized'})
    }
    return next();
  },
  authorize: async (req, res, next) => {
    // let token1 = req.headers['authorization'].split(' ')[1];
    let token1 = req.cookies['access-token1'];
    let token2 = req.cookies['access-token2'];
    let user, decoded, rtoken, refreshtoken;

    if (!token1 && token2) {
      console.log('NO TOKENS!')
      return next()
    }
    
    let accesstoken = token1+token2;
    
    // Try to verify token and return the user in req.user to authorize routes
    try {
      let atoken = await VerifyToken(accesstoken, process.env.JWT_ACCESS_SECRET);
      console.log('ACCESSTOKEN STILL VALID')
      console.log(atoken)
      user = {
        id: atoken.id,
        email: atoken.email
      }
      // await DB.GetUser(atoken.id);
    } catch (err) {
      // Refresh token if expired, otherwise move on
      if (err instanceof jwt.TokenExpiredError) {
        try {
          decoded = jwt.decode(accesstoken);
          refreshtoken = await DB.GetUserToken(decoded.id);

          if (refreshtoken) {
            rtoken = jwt.verify(refreshtoken, process.env.JWT_REFRESH_SECRET);
          }

          if (rtoken.id === decoded.id) {
            RefreshAccesstoken(rtoken, res);
            console.log('ACCESSTOKEN REFRESHED')
            user = await DB.GetUser(decoded.id);            
          }
        } catch (err) {
          if (err instanceof jwt.TokenExpiredError) {
            decoded = jwt.decode(refreshtoken);
            DB.RemoveRefreshToken(decoded.id);
            return next();
          }
        }

      }
    }

    req.user = user;
    return next();
  }
}



// module.exports = {
//   Authenticate: async (req, res, next) => {
//     // let token1 = req.headers['authorization'].split(' ')[1];
//     let token1 = req.cookies['access-token1'];
//     let token2 = req.cookies['access-token2'];
//     let user, decoded, rtoken, refreshtoken;

//     if (!token1 && token2) {
//       console.log('NO TOKENS!')
//       return next()
//     }

//     let accesstoken = token1+token2;

//     // Try to verify token and return the user in req.user to authorize routes
//     try {
//       let atoken = await VerifyToken(accesstoken, process.env.JWT_ACCESS_SECRET);
//       console.log('ACCESSTOKEN STILL VALID')
//       console.log(atoken)
//       user = {
//         id: atoken.id,
//         email: atoken.email
//       }
//       // await DB.GetUser(atoken.id);
//     } catch (err) {
//       // Refresh token if expired, otherwise move on
//       if (err instanceof jwt.TokenExpiredError) {
//         try {
//           decoded = jwt.decode(accesstoken);
//           refreshtoken = await DB.GetUserToken(decoded.id);

//           if (refreshtoken) {
//             rtoken = jwt.verify(refreshtoken, process.env.JWT_REFRESH_SECRET);
//           }

//           if (rtoken.id === decoded.id) {
//             RefreshAccesstoken(rtoken, res);
//             console.log('ACCESSTOKEN REFRESHED')
//             user = await DB.GetUser(decoded.id);            
//           }
//         } catch (err) {
//           if (err instanceof jwt.TokenExpiredError) {
//             decoded = jwt.decode(refreshtoken);
//             DB.RemoveRefreshToken(decoded.id);
//             return next();
//           }
//         }

//       }
//     }

//     req.user = user;
//     return next();
//   }
// }
