const Express = require('express');
const db = require('./models');
const Bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const database = require('./db_sequelize.js');

const User = db.User;
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
app.use(Express.urlencoded({extended: true}));
app.use(Express.json());
app.use(cookieParser());

// Routes
app.get('/', (req, res) => {
  return res.json({msg: "Hello world"});
});

app.post('/login', (req, res) => {
  // Check if users exists
  let { email, password } = req.body.user;

  User.findOne({where : {email}})
    .then((result) => {
      if (!result) {
        res.json({msg: 'No such user exists!'})
      } else {
        // Check if password is correct
        var correctpw = Bcrypt.compareSync(password, result.password);
        if (!correctpw) {
          res.json({msg: 'Incorrect password!'})
        } else {
          let token = jwt.sign({token: email}, process.env.JWT_SECRET, { 
            algorithm: 'HS512',
            expiresIn: '1min'
          });
          console.log(`Token is: ${token}`);
          res.cookie('token', token, { httpOnly: true });
          res.json({token});
        }
      }
    })
    .catch((err) => {
      throw err;
    });
});

app.get('/secretpath', (req, res) => {
  // confirm valid token
  let token = req.cookies['token'];
  try {
    let decodedtoken = jwt.verify(token, process.env.JWT_SECRET);
    return res.json({msg: 'Valid token'});
  } catch (err) {
    return res.json({msg: 'invalid token'});
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await database.GetUsers();
    return res.json(users);
  } catch (err) {
    console.log(err)
    return res.json(err);
  }

  // User.findAll().then((users) => {
  //   res.json({
  //     users
  //   });
  // });
});

app.post('/user', (req, res) => {
  
  let {firstName, lastName, email, password} = req.body.user;
  
  let salt = Bcrypt.genSaltSync(10);
  let hash = Bcrypt.hashSync(password, salt);
  console.log(hash);
  
  User.findOrCreate({where:{email}, defaults: { firstName, lastName, password: hash }})
    .then(([user, created]) => {
      if (created) {
        res.json({msg: 'Created new user', created});
      } else {
        res.json({msg: 'User already exists', user});
      }
    });
});

app.delete('/user', (req, res) => {
  let {email} = req.body.user;
  User.destroy({
    where: {
      email
    }
  }).then((result) => {
    if (result) {
      res.json({msg: "User deleted", result})
    }else {
      res.json({msg: "No such user!", result})      
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
