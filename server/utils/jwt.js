const jwt = require('jsonwebtoken');
//const secret = process.env.JWT_SECRET;
const secret = 'elice';
exports.secret = secret;

exports.setUserToken = (res, user) => {

  const tokenPayload = {
    userId: user.id,
    userName: user.user_name,
    isAdmin: user.admin // 사용자의 관리자 여부 정보를 토큰에 추가
};


    // 유저 jwt 토큰생성
  //const token = jwt.sign({ userId: user.id, userName: user.user_name }, secret);
  const token = jwt.sign(tokenPayload, secret);
  console.log(token);
    // 토큰을 쿠키로 전달
  res.cookie('token', token);
};