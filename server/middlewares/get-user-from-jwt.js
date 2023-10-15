const passport = require('passport');

module.exports = (req, res, next) => {
    const token = req.headers.authorization;
    
    if (!token) {
        next();
        return;
    }

    return passport.authenticate('jwt', { session: false })(req, res, next);
}