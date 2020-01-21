const passport = require('passport');
const authenticate = passport.authenticate('local', { session: false });
const database = require('./../db_sequelize.js');

module.exports = (app) => {
  app.post('/api/login', authenticate, async (req, res) => {
    let { id, email } = req.user;
    let accessToken = CreateAccessToken(email, id);
    let refreshToken = CreateRefreshToken(email, id, accessToken);

    User.update({refreshtoken: refreshToken}, {where: {id: req.user.id}});

    let token1 = accessToken.slice(0, accessToken.indexOf('.', (accessToken.indexOf('.')+1))+1);
    let token2 = accessToken.slice(accessToken.indexOf('.', (accessToken.indexOf('.')+1))+1);

    res.cookie('access-token1', token1, {maxAge: 1000*60*30});  // 30min
    res.cookie('access-token2', token2, { httpOnly: true });
    
    let authUser = {
      isAuth: true
    };
    return res.json(authUser);
  });

  app.get('/api/logout', (req,res) => {
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
