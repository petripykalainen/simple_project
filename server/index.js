const Express = require('express');
const db = require('./models');
const User = db.User;
require('dotenv').config();

// Option 1: Passing parameters separately
// const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
//   host: process.env.DB_HOST,
//   dialect: 'postgres'
// });

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

app.get('/', (req, res) => {
  res.json({msg: "Hello world"});
});

app.post('/login')

app.get('/users', (req, res) => {
  User.findAll().then((users) => {
    res.json({
      users
    });
  });
});

app.post('/user', (req, res) => {
  // console.log(req.body);
  // res.json(req.body);
  // User.create({firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email})
  let {firstName, lastName, email} = req.body.user;
  // User.findOne({where: { email }}).then((result) => {
  //   console.log(result);
  //   res.json({result})
  // });
  User.findOrCreate({where:{email}, defaults: { firstName, lastName }})
    .then(([user, created]) => {
      if (created) {
        res.json({msg: 'Created new user', created});
      } else {
        res.json({msg: 'User already exists', user});
      }
    })
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
