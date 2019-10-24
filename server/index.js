const Express = require('express');
// const Sequelize = require('sequelize');
require('dotenv').config();

const app = Express();

// const sequelize = require();
// new Sequelize(
// process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD,{
//   host: process.env.DB_HOST,
//   dialect: 'postgres'
// });

// sequelize
//   .authenticate()
//   .then(() => {
//     console.log('Connection has been established successfully.');
//   })
//   .catch(err => {
//     console.error('Unable to connect to the database:', err);
//   });

// Environment
const port = 3001 || process.env.port;
app.use(Express.urlencoded({extended: false}));

app.get('/', (req, res) => {
  res.json({msg: "Hello world"});
});

app.listen(port, (req, res) => {
  console.log(`Server running at port ${port}`);
});
