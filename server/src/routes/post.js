const database = require('../db_sequelize.js');
const db = require('./../../models');
const { User, Post } = db;

module.exports = (app) => {
  app.get('/api/posts', async (req, res) => {
    try {
      const users = await database.GetPosts();
      return res.json(users);
    } catch (err) {
      console.log(err)
      return res.json(err);
    }
  })

  app.get('/api/user/:id', async (req, res) => {
    let {id} = req.params;
    console.log(id);
    const user = await database.GetUser(id);
    console.log(user)
    res.json(user);
  })

  app.post('/api/post', async (req, res) => {
    let {creatorId, title, text} = req.body.post;
    let user, post;

    try {
      // user = await database.GetUser(creatorId);
      post = await Post.create({creatorId, title, text});
      return res.status(200).json(post);
    } catch (err) {
      let {name, message} = err;
      return res.status(500).json({
        error: {
          name,
          message
        }
      })
    }

  });

  app.delete('/api/user', (req, res) => {
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
};
