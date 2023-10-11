const JwtStrategy = require('passport-jwt').Strategy;
const { secret } = require('../../utils/jwt');
const jwt = require('jsonwebtoken');
const cookieExtractor = (req,res) => {
  // req 의 cookies 에서 token 사용하기
  const { token } = req.cookies;
  console.log("jwt.js token:" + token);
  const decoded = jwt.decode(token);
  console.log(decoded);
  //console.log(req);
  return token;
};

const opts = {
  secretOrKey: 'elice', //./utils/jwt 의 secret 사용하기
  jwtFromRequest: cookieExtractor,
}

module.exports = new JwtStrategy(opts, (user, done) => {
  done(null, user);
});