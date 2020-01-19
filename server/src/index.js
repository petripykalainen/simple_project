const Express = require('express');
const db = require('./../models');
const { User } = db;
const Bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const passport = require('passport');

const CreateAccessToken = require('./tokens').CreateAccessToken;
const CreateRefreshToken = require('./tokens').CreateRefreshToken;
const {ValidateTokens} = require('./middleware.js');

const database = require('./db_sequelize.js');

// const passportJWT = require('./passport').initializeJwt(passport);
require('./passport').initializeLocal(passport);

// initializePassport(passport);
const authenticate = passport.authenticate('local', { session: false });
// const checkJwt = passport.authenticate('jwt', {session: false});

require('dotenv').config();

db.sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const app = Express();

// Environment
const port = 5000 || process.env.port;
app.use(Express.urlencoded({ extended: true }));
app.use(Express.json());
app.use(cookieParser());

// Routes
app.get('/', (req, res) => {
  return res.json({ msg: "Hello world" });
});

app.post('/login', authenticate, async (req, res) => {
  console.log('REQUEST USER: ', req.user)
  let { id, email } = req.user;
  let accessToken = CreateAccessToken(email, id);
  let refreshToken = CreateRefreshToken(email, id, accessToken);
  console.log('REFRESHTOKEN: ', refreshToken.length)

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

app.get('/logout', (req,res) => {
  let token1 = req.cookies['access-token1'];
  let token2 = req.cookies['access-token2'];
  let decoded = jwt.decode(token1+token2);

  database.RemoveRefreshToken(decoded.id);

  console.log('Logging user out...')
  res.status(200).clearCookie('access-token1').clearCookie('access-token2').json({status: "Success"});
});

app.get('/secretpath', ValidateTokens, (req, res) => {
  return res.json({msg: 'Succesfully authenticated'});
});

app.get('/users', async (req, res) => {
  try {
    const users = await database.GetUsers();
    return res.json(users);
  } catch (err) {
    console.log(err)
    return res.json(err);
  }
});

app.get('/user/:id', async (req, res) => {
  let {id} = req.params;
  console.log(id);
  const user = await database.GetUser(id);
  console.log(user)
  res.json(user);
})

app.post('/user', (req, res) => {

  let { firstName, lastName, email, password } = req.body.user;

  let salt = Bcrypt.genSaltSync(10);
  let hash = Bcrypt.hashSync(password, salt);
  // console.log(hash);

  User.findOrCreate({ where: { email }, defaults: { firstName, lastName, password: hash } })
    .then(([user, created]) => {
      if (created) {
        return res.json({ msg: 'Created new user', created });
      } else {
        return res.json({ msg: 'User already exists', user });
      }
    });
});

app.delete('/user', (req, res) => {
  let { email } = req.body;
  User.destroy({
    where: {
      email
    }
  }).then((result) => {
    if (result) {
      res.json({ msg: "User deleted", result })
    } else {
      res.json({ msg: "No such user!", result })
    }
  });
});

// Error handling
app.use(function(err, req, res, next) {
  if (!err) {
    next();
  }
  return res.status(500).json({
    Error: err.name,
    Message: err.message
  });
});

app.listen(port, (err, req, res, next) => {
  console.log(`Server running at port ${port}`);
});
