const passport = require('passport');
const { User } = require('../models');
const local = require('./strategies/local');
const kakao = require('./strategies/kakaoStrategy');
const jwt = require('./strategies/jwt');
module.exports = () => {

  // passport.serializeUser((user, done) => {
  //   done(null, user.id);
  // });

  // // 서버에 요청이 있을 때마다 호출됨
  // // done 의 두 번째 인자로 user를 전달하게 되면 req.user로 user의 값을 접근할 수 있게 됨
  //  passport.deserializeUser(async (id, done) => {
  //   try {
  //     const user = await User.findOne({ id: id });
  //     if (!user) {
  //       return done(null, false);
  //     }
  //     done(null, user);
  //   } catch (err) {
  //     done(err, null);
  //   }
  // });
  passport.use('local', local);
  passport.use(jwt);
  passport.use('kakao', kakao);
  
}
