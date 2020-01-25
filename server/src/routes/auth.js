const passport = require('passport');
const jwt = require('jsonwebtoken');

const authenticate = passport.authenticate('local', { session: false }); 

const database = require('./../db_sequelize.js');
const {CreateRefreshToken, CreateAccessToken} = require('./../tokens');

module.exports = (app) => {
  app.post('/api/login', authenticate, (req, res) => {
    let { id, email  } = req.user;

    let accessToken = CreateAccessToken(email, id);
    let refreshToken = CreateRefreshToken(email, id, accessToken);

    database.SaveRefreshToken(id, refreshToken);

    let token1 = accessToken.slice(0, accessToken.indexOf('.', (accessToken.indexOf('.')+1))+1);
    let token2 = accessToken.slice(accessToken.indexOf('.', (accessToken.indexOf('.')+1))+1);

    res.cookie('access-token1', token1, {maxAge: 1000*60*30}); // 30min
    res.cookie('access-token2', token2, { httpOnly: true });
    
    return res.status(200).json({msg:'ok'})
  });

  app.get('/api/logout', (req,res) => {
    let token1 = req.cookies['access-token1'];
    let token2 = req.cookies['access-token2'];
    let decoded = jwt.decode(token1+token2);

    database.RemoveRefreshToken(decoded.id);

    console.log('Logging user out...')
    res.status(200).
      clearCookie('access-token1').
      clearCookie('access-token2').
      json({status: "Success"});
  });

  app.post('/api/signup', (req, res) => {

    let { firstName, lastName, email, password } = req.body.user;

    let salt = Bcrypt.genSaltSync(10);
    let hash = Bcrypt.hashSync(password, salt);
    // console.log(hash);

    User.findOrCreate({ 
      where: { email },  
      defaults: { 
        firstName, 
        lastName, 
        password: hash 
      }
    })
      .then(([user, created]) => {
        if (created) {
          return res.json({ msg: 'Created new user', created });
        } else {
          return res.json({ msg: 'User already exists', user });
        }
      });
  });

};
