const Express = require('express');
const db = require('./../models');
const { User, Post } = db;
const Bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const cors = require('cors');

const CreateAccessToken = require('./tokens').CreateAccessToken;
const CreateRefreshToken = require('./tokens').CreateRefreshToken;
// const {ValidateTokens} = require('./middleware');
const {authorize, authenticate} = require('./auth-middleware')

const database = require('./db_sequelize.js');

require('./passport').initializeLocal(passport);
passport.authenticate('local', { session: false });

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
app.use(authorize);

// CORS
const corsOptions = {
  origin: 'http://localhost'
};

app.use(cors(corsOptions));

// Routes
require('./routes/auth')(app);
require('./routes/post')(app);

app.get('/api/helloworld', (req, res) => {
  return res.json({ msg: "Hello world" });
});

app.get('/api/current_user', (req, res) => {
  return res.json(req.user)
});

app.get('/api/secretpath', authenticate, (req, res) => {
  return res.json({user: req.user});
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await database.GetUsers();
    res.json(users);
  } catch (err) {
    console.log(err)
    return res.json(err);
  }
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
