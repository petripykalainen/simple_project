const jwt = require('jsonwebtoken');

module.exports = {
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
      expiresIn: '3min'
    });
  },
  ValidateTokens: (req, res, next) => {
    var atoken = req.cookies['access-token'];
    var rtoken = req.cookies['refresh-token'];

    if (!atoken && !rtoken) {
      req.isAuth = false;
      req.msg = 'No tokens!';
      return next();
    }
    var decodedA, decodedR;

    // Check token R
    try {
      decodedR = jwt.verify(rtoken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      res.cookie('access-token', 'revoked', { httpOnly: true });
      res.cookie('refresh-token', 'revoked', { httpOnly: true });
      req.isAuth = false;
      req.msg = 'Expired/Invalid Token R';
      return next();
    } 
    
    // Check token A
    try {
      decodedA = jwt.verify(atoken, process.env.JWT_ACCESS_SECRET);
    } catch (err) {
      // Check if expired, otherwise reject
      let tokenExpired = err.name === "TokenExpiredError";
      if (!tokenExpired) {
        res.cookie('access-token', 'revoked', { httpOnly: true });
        res.cookie('refresh-token', 'revoked', { httpOnly: true });
        req.isAuth = false;
        req.msg = 'Invalid access';
        return next();
      }

      try {
        // Try to create new accesstoken
        var user = {
          id: decodedR.id,
          email: decodedR.email
        }
        var newToken = jwt.sign(user, process.env.JWT_ACCESS_SECRET, {
          expiresIn: '1min'
        }); 
        res.cookie('access-token', newToken);

      } catch (err) {
        // "Finally" return error
        req.isAuth = false;
        req.msg = 'Beep Boop';
        return next();
      } 
    }
                              
    // With both tokens valid, allow access
    req.isAuth = true;
    req.msg = 'Both tokens valid';
    return next();
  } 

}
