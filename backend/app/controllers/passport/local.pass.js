const { Strategy } = require('passport-local');

const auth = require('../auth.controller');

const LocalStrategy = new Strategy({
    usernameField: 'username',
    passwordField: 'password'
  },
  async (username, password, next) => {
      const user = await auth.getUser(username, password);
      next(null, user);
  }
);

module.exports = LocalStrategy;