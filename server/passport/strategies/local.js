const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../../models');
const bcrypt = require('bcrypt');

const local = new LocalStrategy({
    usernameField: 'email', // 클라이언트에서 보내는 유저 ID 필드명
    passwordField: 'password' // 클라이언트에서 보내는 비밀번호 필드명
  },
  async (useremail, password, done) => {
    try {
        const user = await User.findOne({ email : useremail });
        
        if (!user) {
          throw new Error('회원을 찾을 수 없습니다.');
        }

        const plainUser = user.toObject(); // 또는 user.toJSON();
        const hashedPassword = plainUser.password;

        const passwordMatch =  await bcrypt.compare(password, hashedPassword); 
        console.log(passwordMatch);
        if (!passwordMatch) {
          throw new Error('비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.');
        }

        done(null, plainUser);
    } catch (err) {
      return done(err, null);
    }
  }
);

module.exports = local;
