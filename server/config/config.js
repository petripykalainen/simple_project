 module.exports = {
  "development": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOSTNAME,
    "dialect": "postgres",
    "operatorsAliases": false
  }
  // "development": {
  //   "username": "pguser",
  //   "password": "secretpassword",
  //   "database": "secretdb",
  //   "host": "127.0.0.1",
  //   "dialect": "postgres",
  //   "operatorsAliases": false
  // }
// ,
//   "test": {
//     "username": "root",
//     "password": null,
//     "database": "database_test",
//     "host": "127.0.0.1",
//     "dialect": "mysql",
//     "operatorsAliases": false
//   },
//   "production": {
//     "username": "root",
//     "password": null,
//     "database": "database_production",
//     "host": "127.0.0.1",
//     "dialect": "mysql",
//     "operatorsAliases": false
//   }
}
