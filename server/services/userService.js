const {User} =require('../models')
const hashPassword = require('../utils/hash-password')


class UserService {

  constructor(){}

  //유효성 검사
  formCheck(userinfo){

    const {password,email,phone_number} = userinfo
  const passRE = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/
  const emailRE = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
  const phoneRE = /^\d{11}$/
  
 
  if(!passRE.test(password)){
    throw new Error('비밀번호 작성 양식을 준수해주세요.')
  }//비밀번호는 8~16자에 알파벳,숫자,특수문자가 하나씩 포함돼야함
  if(!emailRE.test(email)){
    throw new Error('올바른 이메일을 입력해주세요.')
  }//email은 알파벳과 숫자의 갯수는 상관없지만 @과 .을 사이에 두는 일반적인 형태로 제한
  if(!(phoneRE.test(phone_number))){
    throw new Error('올바른 전화번호를 입력해주세요.')
  }//전화번호는 -를 뺀 00000000000 형태로 제한
  
}
  //회원가입
  async userJoin(userinfo){
    const {email, user_name,password,phone_number} = userinfo;
    const user = await User.findOne({email})
    if(user) {throw new Error(`이미 등록된 이메일입니다.`)}
    
    const hashedPassword = hashPassword(password);
    const newUserInfo = {email,user_name,password:hashedPassword,
      phone_number
    }

    const newUser = await User.create(newUserInfo)
    return newUser;
  }


  //개인 정보 수정

  async userUpdate(userinfo){
    const {email,password,user_name,phone_number} = userinfo;
    const user = await User.findOne({email})
    if(!user){throw new Error(`없는 계정입니다.`)}
    
    const hashedPassword = hashPassword(password)
   await User.updateOne({email},{
      user_name:user_name,
      password:hashedPassword,
      phone_number:phone_number
    })

  }
  
  //마이프로필
  async myProfile(userinfo){
    const Profile = await User.findOne({email:userinfo})
    return Profile;
  }

async resignUser(userinfo){
  const email = userinfo
  await User.deleteOne({email})
  
}












}

  

const userService = new UserService();

module.exports = {userService};