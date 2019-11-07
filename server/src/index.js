const Express = require('express');
const db = require('./../models');
const { User } = db;
const Bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const passport = require('passport');

const CreateAccessToken = require('./tokens').CreateAccessToken;
const CreateRefreshToken = require('./tokens').CreateRefreshToken;
const ValidateTokens = require('./tokens').ValidateTokens;

const database = require('./db_sequelize.js');

const passportJWT = require('./passport').initializeJwt(passport);
const passportLocal = require('./passport').initializeLocal(passport);

// initializePassport(passport);
const authenticate = passport.authenticate('local', { session: false });
const checkJwt = passport.authenticate('jwt', {session: false});

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
const port = 3001 || process.env.port;
app.use(Express.urlencoded({ extended: true }));
app.use(Express.json());
app.use(cookieParser());


// Routes
app.get('/', (req, res) => {
  return res.json({ msg: "Hello world" });
});

app.post('/login', authenticate, async (req, res) => {
  let { id, email } = req.user;
  
  let accessToken = CreateAccessToken(email, id);
  let refreshToken = CreateRefreshToken(email, id);

  // console.log(`Access Token: ${accessToken}\nRefresh Token: ${refreshToken}`);

  res.cookie('access-token', accessToken);
  res.cookie('refresh-token', refreshToken, { httpOnly: true });
  
  let authUser = {
    id: req.user.id,
    email: req.user.email,
    isAuth: true
  };
  return res.json(authUser);
});

app.get('/secretpath', ValidateTokens, (req, res) => {
  if (req.isAuth) {
    return res.json({
      msg: req.msg,
      jwtError: req.jwtError,
      isAuth: req.isAuth
    });
  }
  return res.json({
    msg: req.msg,
    jwtError: req.jwtError,
    isAuth: req.isAuth
  });

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

app.post('/user', (req, res) => {

  let { firstName, lastName, email, password } = req.body;

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

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
