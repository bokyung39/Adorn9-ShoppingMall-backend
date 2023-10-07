const passport = require('passport');
const { User } = require('../models');
const local = require('./strategies/local');

module.exports = () => {
  passport.use(local);

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({ id });
      if (!user) {
        return done(null, false);
      }
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
}
