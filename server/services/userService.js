

//회원 가입과 정보 수정 시 제약 걸기
exports.check = (password,email,phone) =>{
  const passRE = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/
  const emailRE = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
  const phoneRE1 = /^\d{3}-\d{4}-\d{4}$/
  const phoneRE2 = /^\d{11}$/
  
 
  if(!passRE.test(password)){
    throw new Error('비밀번호 작성 양식을 준수해주세요.')
  }//비밀번호는 8~16자에 알파벳,숫자,특수문자가 하나씩 포함돼야함
  if(!emailRE.test(email)){
    throw new Error('올바른 이메일을 입력해주세요.')
  }//email은 알파벳과 숫자의 갯수는 상관없지만 @과 .을 사이에 두는 일반적인 형태로 제한
  if(!(phoneRE1.test(phone)||phoneRE2.test(phone))){
    throw new Error('올바른 전화번호를 입력해주세요.')
  }//전화번호는 000-0000-0000 혹은 -를 뺀 형태로 제한
  
}

