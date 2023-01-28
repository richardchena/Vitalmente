const passport = require('passport');

const LocalStrategy = require('./local.pass');
const JwtStrategy = require('./jwt.pass');

passport.use(LocalStrategy);
passport.use(JwtStrategy);