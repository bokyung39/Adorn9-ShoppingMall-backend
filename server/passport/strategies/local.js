const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../../models');
//const bcrypt = require('bcrypt');
const hashPassword = require('../../utils/hash-password');
//const formCheck = require('../../services/userService');

//로그인시 
const check = (password,email) =>{
  const passRE = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/
  const emailRE = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
  
  if(!passRE.test(password)){
    throw new Error('비밀번호 작성 양식을 준수해주세요.')
  }//비밀번호는 8~16자에 알파벳,숫자,특수문자가 하나씩 포함돼야함
  if(!emailRE.test(email)){
    throw new Error('올바른 이메일 양식으로 입력해주세요.')
  }//email은 알파벳과 숫자의 갯수는 상관없지만 @과 .을 사이에 두는 일반적인 형태로 제한
  
}

const local = new LocalStrategy({
    usernameField: 'email', // 클라이언트에서 보내는 유저 ID 필드명
    passwordField: 'password' // 클라이언트에서 보내는 비밀번호 필드명
  },
  async (useremail, password, done) => {
    try {
      //formCheck.check(password,useremail);
      check(password, useremail);
      const user = await User.findOne({ email : useremail });
      console.log(user);
      if (!user) {
        throw new Error('회원을 찾을 수 없습니다.');
      }
      if(user.password !== hashPassword(password)){
        throw new Error('비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.');
      }
        

        // const plainUser = user.toObject(); // 또는 user.toJSON();
        // const hashedPassword = plainUser.password;

        // const passwordMatch =  await bcrypt.compare(password, hashedPassword); 
        // console.log(passwordMatch);
        // if (!passwordMatch) {
        //   throw new Error('비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.');
        // }
        
        done(null, {name: user.name});
    } catch (err) {
      return done(err, null);
    }
  }
);

module.exports = local;
