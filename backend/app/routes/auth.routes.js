const router = require('express').Router();
const auth = require("../controllers/auth.controller");
const passport = require('passport');

router.post('/login', passport.authenticate('local', {session: false}), auth.login);
router.post('/verify', auth.verifyToken);

module.exports = router;