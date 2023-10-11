const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../../models');
const hashPassword = require('../../utils/hash-password');

//로그인 유효성 검사
const check = (email, password) => {
  const emailRE = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
  const passRE = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/

  //email은 @과 .을 포함
  if(!emailRE.test(email)){
    throw new Error('올바른 이메일 형식으로 입력해주세요.')
  }
  
  //비밀번호는 알파벳, 숫자, 특수문자가 모두 포함된 8~16자
  if(!passRE.test(password)){
    throw new Error('비밀번호 작성 양식을 준수해주세요.')
  }
}
const local = new LocalStrategy({
    usernameField: 'email', // 클라이언트에서 보내는 유저 ID 필드명
    passwordField: 'password' // 클라이언트에서 보내는 비밀번호 필드명
  },
  async (useremail, password, done) => {
    try {
      check(useremail, password);
      const user = await User.findOne({ email : useremail });
      console.log(user);
      if (!user) {
        throw new Error('회원을 찾을 수 없습니다.');
      }
      if(user.password !== hashPassword(password)){
        throw new Error('비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.');
      } 

        done(null, {
          email:user.email,
          user_name: user.user_name,
          phone_number:user.phone_number
          
            });
    } catch (err) {
      return done(err, null);
    }
  }
);

module.exports = local;
