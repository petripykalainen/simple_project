const Express = require('express');
const db = require('./models');
const Bcrypt = require('bcryptjs');

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

// Routes
app.get('/', (req, res) => {
  res.json({msg: "Hello world"});
});

app.post('/login', (req, res) => {
  // Check if users exists
  let { email, password } = req.body.user;
  console.log(email);
  User.findOne({where : {email}})
    .then((result) => {
      if (!result) {
        res.json({msg: 'No such user exists!'})
      } else {
        // Check if password is correct
        var correctpw = Bcrypt.compareSync(password, result.password);
        res.json(correctpw);
      }
    })
    .catch((err) => {
      throw err;
    });
});

app.get('/users', (req, res) => {
  User.findAll().then((users) => {
    res.json({
      users
    });
  });
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
